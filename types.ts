// Tipe data aplikasi. Bentuk record mengikuti output scripts/build-data.mjs.

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface SSWField {
  id: string;
  level: ConfidenceLevel | string;
}

export interface TSKRecord {
  reg_number: string;
  office_seq: number;
  office_type: 'Main' | 'Branch';
  name: string;
  hq_name: string | null;
  zipcode: string | null;
  address: string | null;
  prefecture: string | null;
  phone: string | null;
  representative: string | null;
  reg_date: string | null;
  support_legal: boolean | null;
  support_optional: boolean | null;
  support_start_date: string | null;
  languages: string[];
  ssw_fields: SSWField[];
}

export interface LanguageOption {
  name: string;
  count: number;
}

export interface Manifest {
  generated_at: string;
  source_updated_at: string;
  total_rows: number;
  total_organizations: number;
  branches: number;
  labeled_organizations: number;
  prefecture_unknown: number;
  ssw_fields: { id: string; name_ja: string; name_id: string }[];
  languages: LanguageOption[];
}

export interface SearchFilters {
  query: string;
  prefectures: string[];
  languages: string[];
  excludedLanguages: string[];
  /** id bidang SSW (lihat SSW_FIELDS_META). Kosong = semua bidang. */
  sswFields: string[];
  dateSort: 'newest' | 'oldest' | null;
  supportLegal: boolean;
  supportOptional: boolean;
}

export type SearchMode = 'simple' | 'advanced';

export interface PrefectureStat {
  prefecture: string;
  total_tsk: number;
  total_tags_analyzed: number;
  ssw: Record<string, number>;
}

export interface AnalyticsData {
  overview: {
    totalTSK: number;
    labeledTSK: number;
    totalRows: number;
    prefectureUnknown: number;
  };
  leaderboardRows: PrefectureStat[];
  national: { id: string; count: number }[];
  snapshotDate: string;
}
