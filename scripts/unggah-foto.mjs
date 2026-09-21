#!/usr/bin/env node
/**
 * Unggah foto galeri ke Supabase Storage + catat di database.
 *
 *   node scripts/unggah-foto.mjs ./foto
 *
 * Struktur folder yang dibaca:
 *
 *   foto/
 *   ├─ wisata-semanggi/
 *   │  ├─ _kawasan/              ← foto proyek (scope: project)
 *   │  │  ├─ sampul.jpg          ← dipakai di kartu proyek & hero
 *   │  │  ├─ gerbang.jpg
 *   │  │  ├─ fasilitas-1.jpg     ← angka = urutan
 *   │  │  ├─ fasilitas-2.jpg
 *   │  │  └─ siteplan.png
 *   │  ├─ nitida-80/             ← foto tipe (scope: type), nama = slug tipe
 *   │  │  ├─ sampul.jpg
 *   │  │  ├─ render.jpg
 *   │  │  ├─ denah-1.png
 *   │  │  ├─ denah-2.png
 *   │  │  └─ interior-1.jpg
 *   │  └─ germinans-93/
 *   └─ wisata-bukit-sentul/
 *      └─ _kawasan/
 *
 * Nama file = kategori[-urutan].ext
 * Kategori yang dikenal: sampul render denah interior eksterior gerbang
 *   fasilitas jalan taman lokasi siteplan progres serah-terima foto
 *
 * Skrip ini:
 *   1. mengecilkan foto ke maks 1800 px sisi terpanjang, ubah ke WebP
 *      (denah/siteplan tetap PNG supaya garis tajam)
 *   2. mengunggah ke bucket "galeri"
 *   3. mencatat ke web.photos lewat fungsi upsert_photo
 *
 * Aman diulang: file yang sama akan ditimpa, bukan digandakan.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

// ---------- env ----------
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!process.argv.includes("--dry-run") && (!url || !key)) {
  console.error("Butuh NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Jalankan:  set -a && source .env.local && set +a");
  process.exit(1);
}
const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

const KATEGORI = new Set([
  "sampul", "render", "denah", "interior", "eksterior", "gerbang",
  "fasilitas", "jalan", "taman", "lokasi", "siteplan", "progres",
  "serah-terima", "foto",
]);
const TAJAM = new Set(["denah", "siteplan", "lokasi"]); // tetap PNG
const EXT_OK = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const NAMA_KATEGORI = {
  sampul: "Foto sampul", render: "Tampak depan", denah: "Denah",
  interior: "Interior", eksterior: "Rumah contoh", gerbang: "Gerbang masuk",
  fasilitas: "Fasilitas", jalan: "Jalan kawasan", taman: "Taman",
  lokasi: "Peta lokasi", siteplan: "Siteplan", progres: "Progres pembangunan",
  "serah-terima": "Serah terima", foto: "Foto",
};

// ---------- util ----------
const DRY = process.argv.includes("--dry-run");
const root = path.resolve(process.argv.find((a, i) => i >= 2 && !a.startsWith("--")) ?? "./foto");
let ok = 0, lewat = 0, gagal = 0;

function labelIndah(slug) {
  return slug.split("-").map((s) => s[0]?.toUpperCase() + s.slice(1)).join(" ");
}

async function* jalanFile(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* jalanFile(p);
    else yield p;
  }
}

async function proses(file) {
  const rel = path.relative(root, file);
  const bagian = rel.split(path.sep);
  if (bagian.length !== 3) { console.log(`  lewat  ${rel} (bukan proyek/tipe/file)`); lewat++; return; }

  const [projectSlug, folder, nama] = bagian;
  const ext = path.extname(nama).toLowerCase();
  if (!EXT_OK.has(ext)) { console.log(`  lewat  ${rel} (bukan gambar)`); lewat++; return; }

  const dasar = path.basename(nama, ext);
  const m = dasar.match(/^([a-z-]+?)(?:-(\d+))?$/);
  if (!m) { console.log(`  lewat  ${rel} (nama tidak dikenal)`); lewat++; return; }

  const [, kategori, urutStr] = m;
  if (!KATEGORI.has(kategori)) { console.log(`  lewat  ${rel} (kategori "${kategori}" tidak dikenal)`); lewat++; return; }

  const urutan = urutStr ? parseInt(urutStr, 10) : (kategori === "sampul" ? 0 : 50);
  const scope = folder === "_kawasan" ? "project" : "type";
  const typeSlug = scope === "type" ? folder : null;

  // ---------- olah gambar ----------
  const buf = await readFile(file);
  let img = sharp(buf).rotate(); // pakai orientasi EXIF
  const meta = await img.metadata();
  const maks = 1800;
  if ((meta.width ?? 0) > maks || (meta.height ?? 0) > maks) {
    img = img.resize({ width: maks, height: maks, fit: "inside", withoutEnlargement: true });
  }

  let keluar, extKeluar, mime;
  if (TAJAM.has(kategori)) {
    keluar = await img.png({ compressionLevel: 9 }).toBuffer();
    extKeluar = ".png"; mime = "image/png";
  } else {
    keluar = await img.webp({ quality: 82 }).toBuffer();
    extKeluar = ".webp"; mime = "image/webp";
  }
  const dim = await sharp(keluar).metadata();

  const storagePath = `${projectSlug}/${folder}/${dasar}${extKeluar}`;

  // ---------- unggah ----------
  if (DRY) {
    const kb = Math.round(keluar.length / 1024);
    console.log(`  uji    ${rel}  →  ${storagePath}  (${dim.width}×${dim.height}, ${kb} KB, ${scope}/${kategori}#${urutan})`);
    ok++; return;
  }
  const { error: eUp } = await supabase.storage
    .from("galeri")
    .upload(storagePath, keluar, { contentType: mime, upsert: true, cacheControl: "31536000" });
  if (eUp) { console.log(`  GAGAL  ${rel}: ${eUp.message}`); gagal++; return; }

  // ---------- catat ----------
  const namaProyek = labelIndah(projectSlug);
  const namaTipe = typeSlug ? labelIndah(typeSlug.replace(/-\d+$/, "")) : null;
  const alt = typeSlug
    ? `${NAMA_KATEGORI[kategori]} tipe ${namaTipe} di ${namaProyek}`
    : `${NAMA_KATEGORI[kategori]} ${namaProyek}`;

  const { error: eDb } = await supabase.rpc("upsert_photo", {
    p_scope: scope,
    p_project_slug: projectSlug,
    p_type_slug: typeSlug,
    p_unit_block: null,
    p_category: kategori,
    p_storage_path: storagePath,
    p_alt: alt,
    p_caption: null,
    p_width: dim.width ?? null,
    p_height: dim.height ?? null,
    p_sort_order: urutan,
  });
  if (eDb) { console.log(`  GAGAL  ${rel}: ${eDb.message}`); gagal++; return; }

  const kb = Math.round(keluar.length / 1024);
  console.log(`  ok     ${rel}  →  ${storagePath}  (${dim.width}×${dim.height}, ${kb} KB)`);
  ok++;
}

// ---------- jalan ----------
try { await stat(root); } catch { console.error(`Folder tidak ada: ${root}`); process.exit(1); }

console.log(`Membaca ${root}${DRY ? "  (mode uji, tidak mengunggah)" : ""}\n`);
for await (const f of jalanFile(root)) {
  try { await proses(f); }
  catch (e) { console.log(`  GAGAL  ${path.relative(root, f)}: ${e.message}`); gagal++; }
}
console.log(`\nSelesai: ${ok} diunggah, ${lewat} dilewati, ${gagal} gagal.`);
process.exit(gagal ? 1 : 0);
