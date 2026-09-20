// Identitas & kontak situs — satu tempat untuk semua halaman.
// Ubah di sini, berlaku di header, footer, metadata, dan structured data.

export const SITE = {
  name: "Graha Agung Kencana Group",
  legalName: "PT Graha Agung Perkasa",
  shortName: "GAK Property",
  tagline: "Rumah dan ruko siap huni di Surabaya, Malang, dan Sidoarjo",
  description:
    "Developer properti Graha Agung Kencana Group. Rumah tinggal dan ruko bersertifikat SHGB di Wisata Semanggi Surabaya, Wisata Bukit Sentul Malang, dan Blukid Residence 3 Sidoarjo. Langsung dari developer.",

  // Ganti setelah punya domain sendiri, mis. https://grahagung.co.id
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://grahagung-web.vercel.app",

  address: {
    street: "Jl. Margorejo Indah Blok A No. 202",
    district: "Margorejo, Kecamatan Wonocolo",
    city: "Surabaya",
    province: "Jawa Timur",
  },

  phone: "031-8797799",
  phoneAlt: "031-8484455",

  // Nomor WhatsApp sales — ganti dengan nomor resmi (format 62…)
  whatsapp: process.env.NEXT_PUBLIC_WA_NUMBER ?? "6281234567890",

  social: {
    instagram: "https://www.instagram.com/wisatasemanggi",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/@grahaagungkencanagroup",
  },
} as const;

export function waLink(pesan?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return pesan ? `${base}?text=${encodeURIComponent(pesan)}` : base;
}

export const NAV = [
  { href: "/perumahan", label: "Perumahan" },
  { href: "/galeri", label: "Galeri" },
  { href: "/cara-membeli", label: "Cara Membeli" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
] as const;
