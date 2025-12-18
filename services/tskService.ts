import { supabase } from './supabaseClient';
import { TSKData, SearchFilters } from '../types';

const TABLE_NAME = 'tsk_id';
const PAGE_SIZE = 20;

// Helper to get or create a persistent Device ID for this browser
export const getDeviceId = (): string => {
  const STORAGE_KEY = 'philia_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    // Generate a random UUID if not exists
    deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  
  return deviceId;
};

export const fetchTSK = async (
  page: number,
  filters: SearchFilters,
  mode: 'simple' | 'advanced'
) => {
  let query = supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' });

  // Simple Search Mode logic
  if (mode === 'simple' && filters.query.trim() !== '') {
    const searchTerm = `%${filters.query.trim()}%`;
    query = query.or(`company_name.ilike.${searchTerm},branch_name.ilike.${searchTerm},address.ilike.${searchTerm},branch_address.ilike.${searchTerm}`);
  }

  // Advanced Search Mode logic
  if (mode === 'advanced') {
    // Prefecture Filter (Matches address OR branch_address)
    if (filters.prefectures.length > 0) {
      const prefConditions = filters.prefectures.map(pref => `address.ilike.%${pref}%,branch_address.ilike.%${pref}%`).join(',');
      query = query.or(prefConditions);
    }

    // Language Filter
    if (filters.languages.length > 0) {
       const langConditions = filters.languages.map(lang => {
         const cleanLang = lang.split(' ')[0]; 
         return `language.ilike.%${cleanLang}%`;
       }).join(',');
       query = query.or(langConditions);
    }

    // Support Status
    if (filters.supportLegal) {
      query = query.eq('support_legal', 'Yes');
    }
    if (filters.supportOptional) {
      query = query.eq('support_optional', 'Yes');
    }
  }

  // Pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Sorting: Most Liked First (Descending), then ID
  const { data, error, count } = await query
    .order('total_likes', { ascending: false })
    .order('id', { ascending: true })
    .range(from, to);

  if (error) {
    throw error;
  }

  return { data: data as TSKData[], count, pageSize: PAGE_SIZE };
};

// Check which TSKs in the current list are liked by this device
export const fetchUserLikedIds = async (tskIds: number[]): Promise<number[]> => {
  if (tskIds.length === 0) return [];
  
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('tsk_likes')
    .select('tsk_id')
    .eq('device_id', deviceId)
    .in('tsk_id', tskIds);

  if (error) {
    console.error("Error fetching likes", error);
    return [];
  }

  return data.map((row: any) => row.tsk_id);
};

// Toggle Like (Call RPC)
export const toggleLikeTSK = async (tskId: number) => {
  const deviceId = getDeviceId();
  
  // Calls the PostgreSQL function we created
  const { data, error } = await supabase.rpc('toggle_tsk_like', {
    target_tsk_id: tskId,
    user_device_id: deviceId
  });

  if (error) throw error;
  
  // data returns { liked: boolean, total: number }
  return data as { liked: boolean, total: number };
};