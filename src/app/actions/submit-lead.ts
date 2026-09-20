"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getPropertyBySlug } from "@/lib/properties-db";

export type LeadFormState = {
  status: "idle" | "ok" | "error";
  message: string;
};

/** Ubah 08xx / +62 8xx / 8xx menjadi 628xx. */
function normalkanNomor(input: string): string | null {
  const angka = input.replace(/\D/g, "");
  if (!angka) return null;

  let hasil = angka;
  if (hasil.startsWith("0")) hasil = "62" + hasil.slice(1);
  else if (hasil.startsWith("8")) hasil = "62" + hasil;

  // Nomor Indonesia yang masuk akal: 62 + 9..13 digit
  if (!/^62\d{9,13}$/.test(hasil)) return null;
  return hasil;
}

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  // Jebakan bot: kolom tersembunyi yang tidak akan diisi manusia.
  if ((formData.get("website") as string | null)?.trim()) {
    return { status: "ok", message: "Terima kasih, pesan Anda sudah kami terima." };
  }

  const nama = ((formData.get("nama") as string) ?? "").trim();
  const telepon = ((formData.get("telepon") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const pesan = ((formData.get("pesan") as string) ?? "").trim();
  const slug = ((formData.get("slug") as string) ?? "").trim();

  if (nama.length < 2 || nama.length > 100) {
    return { status: "error", message: "Mohon isi nama lengkap Anda." };
  }

  const wa = normalkanNomor(telepon);
  if (!wa) {
    return {
      status: "error",
      message: "Nomor WhatsApp tidak valid. Contoh: 081234567890",
    };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "Alamat email tidak valid." };
  }

  if (pesan.length > 1000) {
    return { status: "error", message: "Pesan terlalu panjang (maksimal 1000 karakter)." };
  }

  // Unit yang diminati diambil dari DATABASE berdasarkan slug,
  // bukan dari data yang dikirim browser.
  let catatan = "Dikirim lewat website.";
  if (slug) {
    const unit = await getPropertyBySlug(slug);
    if (unit) {
      catatan =
        `Minat unit ${unit.block} — ${unit.project} ` +
        `(${unit.buildingArea}/${unit.landArea ?? "-"} m², ${unit.floor}).`;
    }
  }
  if (pesan) catatan += `\n\nPesan: ${pesan}`;

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from("leads").insert({
      name: nama,
      phone: wa,
      wa_phone: wa,
      email: email || null,
      source: "website",
      status: "no_respon",
      notes: catatan,
      input_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // assigned_to & created_by sengaja dikosongkan:
      // manajer yang menentukan sales penanggung jawab.
    });

    if (error) {
      console.error("Gagal menyimpan lead:", error);
      return {
        status: "error",
        message: "Maaf, terjadi gangguan. Silakan coba lagi atau hubungi 031-8797799.",
      };
    }
  } catch (e) {
    console.error("Gagal menyimpan lead:", e);
    return {
      status: "error",
      message: "Maaf, terjadi gangguan. Silakan coba lagi atau hubungi 031-8797799.",
    };
  }

  return {
    status: "ok",
    message: "Terima kasih. Tim pemasaran kami akan menghubungi Anda segera.",
  };
}
