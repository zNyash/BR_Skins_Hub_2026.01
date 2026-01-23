import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlayer = mutation({
  args: {
    name: v.string(),
    osu_id: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("players", {
      osu_id: args.osu_id,
      name: args.name,
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

export const updatePlayer = mutation({
  args: {
    id: v.id("players"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});
