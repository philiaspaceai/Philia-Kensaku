
export interface TSKData {
  id: number;
  office_type: string;
  reg_number: string;
  reg_date: string;
  company_name: string;
  zipcode: string;
  address: string;
  phone: string;
  representative: string;
  branch_name: string | null;
  branch_zipcode: string | null;
  branch_address: string | null;
  support_legal: string; // "Yes" | "No"
  support_optional: string; // "Yes" | "No"
  support_start_date: string | null;
  language: string | null;
  note: string | null;
  total_likes: number; // New field for like count
  tags: string | null; // New field for AI Tags (Comma separated codes like "A,B,K")
}

export interface SearchFilters {
  query: string;
  prefectures: string[];
  languages: string[];
  excludedLanguages: string[]; // New field for exclusion
  dateSort: 'newest' | 'oldest' | null; // New field for date sorting
  supportLegal: boolean;
  supportOptional: boolean;
}

export type SearchMode = 'simple' | 'advanced';

// Matches 'leaderboard_data' table in Supabase
export interface LeaderboardRow {
  id: number;
  prefecture: string;
  total_tsk: number;
  total_tags_analyzed: number;
  ssw_a: number;
  ssw_b: number;
  ssw_c: number;
  ssw_d: number;
  ssw_e: number;
  ssw_f: number;
  ssw_g: number;
  ssw_h: number;
  ssw_i: number;
  ssw_j: number;
  ssw_k: number;
  ssw_l: number;
}

export interface AnalyticsData {
  overview: {
    totalTSK: number;
    analyzedTSK: number;
  };
  leaderboardRows: LeaderboardRow[];
  topLikedTSK: TSKData[];
  lastUpdated: number;
}
