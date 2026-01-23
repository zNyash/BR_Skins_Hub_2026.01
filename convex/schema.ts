import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /* ------- */
  /* Players */
  /* ------- */
  players: defineTable({
    name: v.string(),
    osu_id: v.number(),
  }).index("by_osu_id", ["osu_id"]),

  /* ----- */
  /* Skins */
  /* ----- */
  skins: defineTable({
    name: v.string(),
    author: v.optional(v.string()),
    download_url: v.string(),
    download_count: v.number(),
    preview_images: v.array(v.string()),
  }).index("by_name", ["name"]),

  /* ------------------------- */
  /* Player Skins Relation N:N */
  /* ------------------------- */
  playerSkins: defineTable({
    player_id: v.id("players"),
    skin_id: v.id("skins"),
  })
    .index("by_player", ["player_id"])
    .index("by_skin", ["skin_id"])
    .index("by_player_skin", ["player_id", "skin_id"]),
});
