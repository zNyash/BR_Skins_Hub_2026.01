import type { H3Event } from "h3";
import { setResponseHeader } from "h3";

type RateLimiterOptions = {
  key: string;
  maxRequests: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function getClientIp(event: H3Event): string {
  const forwardedFor = event.node.req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return event.node.req.socket.remoteAddress || "unknown";
}

function getBucketKey(event: H3Event, key: string): string {
  return `${key}:${getClientIp(event)}`;
}

function cleanupExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { key, maxRequests, windowMs } = options;

  return {
    check(event: H3Event) {
      const now = Date.now();
      cleanupExpiredBuckets(now);

      const bucketKey = getBucketKey(event, key);
      const existingBucket = buckets.get(bucketKey);

      if (!existingBucket || existingBucket.resetAt <= now) {
        buckets.set(bucketKey, {
          count: 1,
          resetAt: now + windowMs,
        });
        return;
      }

      if (existingBucket.count >= maxRequests) {
        const retryAfterSeconds = Math.max(1, Math.ceil((existingBucket.resetAt - now) / 1000));

        setResponseHeader(event, "Retry-After", retryAfterSeconds);

        throw createError({
          statusCode: 429,
          message: "Too many requests",
        });
      }

      existingBucket.count += 1;
      buckets.set(bucketKey, existingBucket);
    },
  };
}
