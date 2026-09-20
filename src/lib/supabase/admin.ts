import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase dengan hak penuh (service role).
 *
 * HANYA boleh dipakai di Server Action / Route Handler.
 * Kuncinya TIDAK berawalan NEXT_PUBLIC_, jadi tidak pernah
 * ikut terkirim ke browser.
 *
 * Jangan pernah mengimpor file ini dari komponen client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local"
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
