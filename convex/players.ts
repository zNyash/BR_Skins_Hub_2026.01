import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlayer = mutation({
  args: {
    name: v.string(),
    osu_id: v.number(),
    cover_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("players", {
      osu_id: args.osu_id,
      name: args.name,
      cover_url: args.cover_url,
    });
  },
});

export const listPlayers = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query("players").collect();
  },
});

export const getPlayer = query({
  args: {
    id: v.id("players"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPlayerByOsuId = query({
  args: { osu_id: v.number() },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_osu_id", (q) => q.eq("osu_id", args.osu_id))
      .first();
    return players;
  },
});

export const updatePlayer = mutation({
  args: {
    id: v.id("players"),
    name: v.optional(v.string()),
    cover_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: any = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.cover_url !== undefined) patch.cover_url = args.cover_url;

    await ctx.db.patch(args.id, patch);
  },
});

export const deletePlayer = mutation({
  args: {
    player_id: v.id("players"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.player_id);
  },
});
