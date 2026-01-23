import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addSkinToPlayer = mutation({
  args: {
    player_id: v.id("players"),
    skin_id: v.id("skins"),
  },
  handler: async (ctx, args) => {
    const exists = await ctx.db
      .query("playerSkins")
      .withIndex("by_player_skin", (q) => q.eq("player_id", args.player_id).eq("skin_id", args.skin_id))
      .first();

    if (exists) {
      console.error("Skin already added to player");
      return;
    }

    await ctx.db.insert("playerSkins", {
      player_id: args.player_id,
      skin_id: args.skin_id,
    });
  },
});

export const removeSkinFromPlayer = mutation({
  args: {
    player_id: v.id("players"),
    skin_id: v.id("skins"),
  },
  handler: async (ctx, args) => {
    const relation = await ctx.db
      .query("playerSkins")
      .withIndex("by_player_skin", (q) => q.eq("player_id", args.player_id).eq("skin_id", args.skin_id))
      .first();

    if (!relation) {
      console.error("Skin not found for player");
      return;
    }

    await ctx.db.delete(relation._id);
  },
});

export const getSkinsByPlayer = query({
  args: { player_id: v.optional(v.id("players")) },
  handler: async (ctx, args) => {
    if (!args.player_id) return [];

    const relations = await ctx.db
      .query("playerSkins")
      .withIndex("by_player", (q) => q.eq("player_id", args.player_id as any))
      .collect();

    const skins = await Promise.all(relations.map((r) => ctx.db.get(r.skin_id)));
    return skins.filter((s) => s !== null);
  },
});

export const addSkinsToPlayer = mutation({
  args: {
    player_id: v.id("players"),
    skin_ids: v.array(v.id("skins")),
  },
  handler: async (ctx, args) => {
    for (const skinId of args.skin_ids) {
      const exists = await ctx.db
        .query("playerSkins")
        .withIndex("by_player_skin", (q) => q.eq("player_id", args.player_id).eq("skin_id", skinId))
        .first();

      if (!exists) {
        await ctx.db.insert("playerSkins", {
          player_id: args.player_id,
          skin_id: skinId,
        });
      }
    }
  },
});
