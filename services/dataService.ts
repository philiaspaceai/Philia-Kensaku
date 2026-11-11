import type {
  AnalyticsData,
  LanguageOption,
  Manifest,
  PrefectureStat,
  SearchFilters,
  TSKRecord,
} from '../types';

const BASE = import.meta.env.BASE_URL;
const DATA_URL = `${BASE}data/tsk.json`;
const MANIFEST_URL = `${BASE}data/manifest.json`;

export const PAGE_SIZE = 20;

interface Dataset {
  manifest: Manifest;
  records: TSKRecord[];
}

let cache: Dataset | null = null;
let inflight: Promise<Dataset> | null = null;

/** Muat sekali, simpan di memori. Dipanggil dari App dan halaman Analytics. */
export function loadDataset(): Promise<Dataset> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = (async () => {
    const [manifestRes, dataRes] = await Promise.all([
      fetch(MANIFEST_URL),
      fetch(DATA_URL),
    ]);

    if (!manifestRes.ok || !dataRes.ok) {
      throw new Error(`Gagal mengunduh data (${dataRes.status})`);
    }

    const manifest = (await manifestRes.json()) as Manifest;
    const records = (await dataRes.json()) as TSKRecord[];

    cache = { manifest, records };
    return cache;
  })();

  inflight.catch(() => {
    inflight = null; // biar bisa dicoba ulang
  });

  return inflight;
}

export function getCached(): Dataset | null {
  return cache;
}

// --- Filter & urut (semua di browser, tidak ada query database) ------------

export function filterRecords(records: TSKRecord[], filters: SearchFilters): TSKRecord[] {
  const q = filters.query.trim().toLowerCase();

  return records.filter((r) => {
    if (q) {
      const hay = `${r.name} ${r.hq_name ?? ''} ${r.address ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (filters.prefectures.length > 0) {
      if (!r.prefecture || !filters.prefectures.includes(r.prefecture)) return false;
    }

    if (filters.languages.length > 0) {
      const has = filters.languages.some((lang) => r.languages.includes(lang));
      if (!has) return false;
    }

    if (filters.excludedLanguages.length > 0) {
      const blocked = filters.excludedLanguages.some((lang) => r.languages.includes(lang));
      if (blocked) return false;
    }

    if (filters.supportLegal && r.support_legal !== true) return false;
    if (filters.supportOptional && r.support_optional !== true) return false;

    return true;
  });
}

/** Default: tanggal mulai operasi terbaru. Tanggal kosong selalu di bawah. */
export function sortRecords(records: TSKRecord[], dateSort: SearchFilters['dateSort']): TSKRecord[] {
  const dir = dateSort === 'oldest' ? 1 : -1;

  return [...records].sort((a, b) => {
    const da = a.support_start_date;
    const db = b.support_start_date;

    if (!da && !db) return a.reg_number.localeCompare(b.reg_number);
    if (!da) return 1;
    if (!db) return -1;
    if (da === db) return a.reg_number.localeCompare(b.reg_number);
    return da < db ? -dir : dir;
  });
}

export function paginate(records: TSKRecord[], page: number) {
  const from = (page - 1) * PAGE_SIZE;
  return {
    pageItems: records.slice(from, from + PAGE_SIZE),
    total: records.length,
    totalPages: Math.ceil(records.length / PAGE_SIZE),
    pageSize: PAGE_SIZE,
  };
}

/** Kunci stabil per baris: cabang berbagi nomor registrasi dengan pusat. */
export function recordKey(r: TSKRecord): string {
  return `${r.reg_number}-${r.office_seq}`;
}

// --- Statistik -------------------------------------------------------------

/**
 * Hitung agregat per prefektur dari dataset yang sudah dimuat.
 * Aturan: sektor hanya dihitung dari baris "Main", karena cabang berbagi label
 * dengan kantor pusat — kalau ikut dihitung, angka sektor membengkak.
 */
export function computeAnalytics(records: TSKRecord[], manifest: Manifest): AnalyticsData {
  const byPref = new Map<string, PrefectureStat>();
  const national = new Map<string, number>();

  let labeled = 0;

  for (const r of records) {
    const pref = r.prefecture;
    if (pref) {
      let row = byPref.get(pref);
      if (!row) {
        row = { prefecture: pref, total_tsk: 0, total_tags_analyzed: 0, ssw: {} };
        byPref.set(pref, row);
      }
      row.total_tsk += 1;

      if (r.office_type === 'Main' && r.ssw_fields.length > 0) {
        row.total_tags_analyzed += 1;
        for (const f of r.ssw_fields) {
          row.ssw[f.id] = (row.ssw[f.id] ?? 0) + 1;
        }
      }
    }

    if (r.office_type === 'Main' && r.ssw_fields.length > 0) {
      labeled += 1;
      for (const f of r.ssw_fields) {
        national.set(f.id, (national.get(f.id) ?? 0) + 1);
      }
    }
  }

  const leaderboardRows = [...byPref.values()].sort((a, b) => b.total_tsk - a.total_tsk);

  return {
    overview: {
      totalTSK: leaderboardRows.reduce((sum, r) => sum + r.total_tsk, 0),
      labeledTSK: labeled,
      totalRows: records.length,
      prefectureUnknown: manifest.prefecture_unknown,
    },
    leaderboardRows,
    national: [...national.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count),
    snapshotDate: manifest.source_updated_at || manifest.generated_at,
  };
}

export function languageOptions(manifest: Manifest): LanguageOption[] {
  return manifest.languages;
}
