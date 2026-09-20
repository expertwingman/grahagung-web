// Teks pemasaran per proyek. Angka (jumlah unit, harga) TIDAK di sini —
// diambil dari database lewat getProjectSummaries().

export type ProjectInfo = {
  slug: string;
  name: string;
  area: string;          // mis. "Surabaya Timur" — lebih spesifik dari kota
  tagline: string;
  description: string;   // 1 paragraf untuk halaman proyek & metadata
  highlights: string[];  // poin singkat, tampil sebagai daftar
  facilities: string[];
  nearby: { label: string; minutes: number }[];
  hasSiteplan: boolean;
};

export const PROJECTS: Record<string, ProjectInfo> = {
  "wisata-semanggi": {
    slug: "wisata-semanggi",
    name: "Wisata Semanggi",
    area: "Surabaya Timur",
    tagline: "Lifestyle & Green Living",
    description:
      "Wisata Semanggi adalah hunian premium di kawasan Surabaya Timur yang berdekatan dengan Ekowisata Mangrove Wonorejo. Akses langsung ke OERR dan MERR memudahkan perjalanan ke pusat kota dan Bandara Juanda. Kawasan one gate system dengan ROW jalan 8 meter, dikelola langsung oleh developer.",
    highlights: [
      "One gate system dengan keamanan 24 jam",
      "ROW jalan 8 meter di dalam kawasan",
      "5 menit dari Ekowisata Mangrove dan OERR",
      "Pilihan rumah 1 lantai dan 2 lantai",
      "Sertifikat SHGB per kavling",
    ],
    facilities: [
      "Club house",
      "Kolam renang",
      "Gym",
      "Musholla",
      "Jogging track",
    ],
    nearby: [
      { label: "Ekowisata Mangrove Wonorejo", minutes: 5 },
      { label: "Transmart, RS Premier Surabaya", minutes: 10 },
      { label: "Galaxy Mall, Universitas Airlangga, ITS", minutes: 20 },
      { label: "Pusat Kota Surabaya", minutes: 30 },
    ],
    hasSiteplan: true,
  },

  "wisata-bukit-sentul": {
    slug: "wisata-bukit-sentul",
    name: "Wisata Bukit Sentul",
    area: "Malang",
    tagline: "Beautiful Living in the Modern City",
    description:
      "Wisata Bukit Sentul adalah kawasan hunian dan komersial di Malang yang berdampingan dengan Kawasan Wisata Rohani Bhinneka Tunggal Ika dan Lukman Al Hakim International Boarding School. Tersedia rumah 1 lantai, 2 lantai, serta ruko 2 lantai di sepanjang akses utama.",
    highlights: [
      "Rumah tinggal dan ruko dalam satu kawasan",
      "Berdampingan dengan kawasan wisata rohani",
      "Dekat sekolah internasional",
      "Sertifikat SHGB per kavling",
    ],
    facilities: [],
    nearby: [],
    hasSiteplan: false,
  },

  "blukid-residence-3": {
    slug: "blukid-residence-3",
    name: "Blukid Residence 3",
    area: "Sidoarjo",
    tagline: "Hunian Nyaman di Sidoarjo",
    description:
      "Blukid Residence 3 menawarkan pilihan rumah 1 lantai dan 2 lantai di Sidoarjo dengan berbagai ukuran tanah, dari 90 m² sampai 129 m². Pilihan yang tepat untuk keluarga muda yang mencari hunian pertama dengan harga terjangkau dan legalitas jelas.",
    highlights: [
      "Rumah 1 lantai mulai 42/90",
      "Pilihan luas tanah 90–129 m²",
      "Sertifikat SHGB per kavling",
    ],
    facilities: [],
    nearby: [],
    hasSiteplan: false,
  },
};

export function getProjectInfo(slug: string): ProjectInfo | undefined {
  return PROJECTS[slug];
}
