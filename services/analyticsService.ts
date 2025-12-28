import { supabase } from './supabaseClient';
import { TSKData, AnalyticsData, LeaderboardRow } from '../types';

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  // 1. Fetch Aggregated Leaderboard Data (Full Table ~47 rows)
  const { data: lbData, error: lbError } = await supabase
    .from('leaderboard_data')
    .select('*')
    .order('total_tsk', { ascending: false });

  if (lbError) throw lbError;

  // 2. Fetch Top 5 Liked TSK (From main table)
  const { data: topLiked, error: likedError } = await supabase
    .from('tsk_id')
    .select('*')
    .order('total_likes', { ascending: false })
    .limit(5);

  if (likedError) throw likedError;

  // 3. Client-side Summation for National Totals
  const rows = lbData as LeaderboardRow[];
  let totalTSK = 0;
  let analyzedTSK = 0;

  rows.forEach(row => {
    totalTSK += row.total_tsk;
    analyzedTSK += row.total_tags_analyzed;
  });

  return {
    overview: {
        totalTSK,
        analyzedTSK
    },
    leaderboardRows: rows,
    topLikedTSK: topLiked as TSKData[],
    lastUpdated: Date.now()
  };
};
