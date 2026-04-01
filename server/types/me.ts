export type OsuGradeCounts = {
  ss: number;
  ssh: number;
  s: number;
  sh: number;
  a: number;
};

export type OsuStatistics = {
  count_100: number;
  count_300: number;
  count_50: number;
  count_miss: number;
  level: { current: number; progress: number };
  global_rank: number | null;
  global_rank_percent: number | null;
  global_rank_exp: number | null;
  pp: number;
  pp_exp: number;
  ranked_score: number;
  hit_accuracy: number;
  accuracy: number;
  play_count: number;
  play_time: number;
  total_score: number;
  total_hits: number;
  maximum_combo: number;
  replays_watched_by_others: number;
  is_ranked: boolean;
  grade_counts: OsuGradeCounts;
  country_rank?: number;
  rank?: { country: number };
};

export type OsuBadge = {
  awarded_at: string;
  description: string;
  "image@2x_url": string;
  image_url: string;
  url: string;
};

export type OsuDailyChallengeStats = {
  daily_streak_best: number;
  daily_streak_current: number;
  last_update: string;
  last_weekly_streak: string;
  playcount: number;
  top_10p_placements: number;
  top_50p_placements: number;
  user_id: number;
  weekly_streak_best: number;
  weekly_streak_current: number;
};

export type OsuPlaycount = {
  start_date: string;
  count: number;
};

export type OsuRankHistory = {
  mode: string;
  data: number[];
};

export type OsuTeam = {
  flag_url: string;
  id: number;
  name: string;
  short_name: string;
};

export type OsuUserAchievement = {
  achieved_at: string;
  achievement_id: number;
};

export type OsuUser = {
  avatar_url: string;
  country_code: string;
  default_group: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit: string;
  pm_friends_only: boolean;
  profile_colour: string | null;
  username: string;
  cover_url: string;
  discord: string | null;
  has_supported: boolean;
  interests: string | null;
  join_date: string;
  location: string | null;
  max_blocks: number;
  max_friends: number;
  occupation: string | null;
  playmode: string;
  playstyle: string[];
  post_count: number;
  profile_hue: number | null;
  profile_order: string[];
  title: string | null;
  title_url: string | null;
  twitter: string | null;
  website: string | null;
  country: { code: string; name: string };
  cover: { custom_url: string | null; url: string; id: string | null };
  is_restricted: boolean;
  kudosu: { available: number; total: number };
  account_history: unknown[];
  active_tournament_banner: unknown | null;
  active_tournament_banners: unknown[];
  badges: OsuBadge[];
  beatmap_playcounts_count: number;
  comments_count: number;
  current_season_stats: unknown | null;
  daily_challenge_user_stats: OsuDailyChallengeStats;
  favourite_beatmapset_count: number;
  follower_count: number;
  graveyard_beatmapset_count: number;
  groups: unknown[];
  guest_beatmapset_count: number;
  loved_beatmapset_count: number;
  mapping_follower_count: number;
  matchmaking_stats: unknown[];
  monthly_playcounts: OsuPlaycount[];
  nominated_beatmapset_count: number;
  page: { html: string; raw: string };
  pending_beatmapset_count: number;
  previous_usernames: string[];
  rank_highest: { rank: number; updated_at: string } | null;
  ranked_beatmapset_count: number;
  replays_watched_counts: OsuPlaycount[];
  scores_best_count: number;
  scores_first_count: number;
  scores_pinned_count: number;
  scores_recent_count: number;
  session_verification_method: unknown | null;
  session_verified: boolean;
  statistics: OsuStatistics;
  statistics_rulesets: {
    osu: OsuStatistics;
    taiko: OsuStatistics;
    fruits: OsuStatistics;
    mania: OsuStatistics;
  };
  support_level: number;
  team: OsuTeam | null;
  user_achievements: OsuUserAchievement[];
  rank_history: OsuRankHistory;
  rankHistory: OsuRankHistory;
  ranked_and_approved_beatmapset_count: number;
  unranked_beatmapset_count: number;
};
