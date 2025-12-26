
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
