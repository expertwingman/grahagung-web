"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadFormState } from "@/app/actions/submit-lead";

const AWAL: LeadFormState = { status: "idle", message: "" };

function TombolKirim() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[#153c33] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#285a4d] disabled:opacity-60"
    >
      {pending ? "Mengirim…" : "Kirim"}
    </button>
  );
}

export default function LeadForm({
  slug,
  mode = "tanya",
}: {
  slug: string;
  /** "beli" = pengajuan pembelian, "tanya" = sekadar bertanya */
  mode?: "beli" | "tanya";
}) {
  const [state, formAction] = useActionState(submitLead, AWAL);

  if (state.status === "ok") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-5 text-center">
        <p className="text-sm font-semibold text-emerald-900">Terkirim</p>
        <p className="mt-1 text-xs leading-5 text-emerald-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="tujuan" value={mode} />

      {/* Jebakan bot — disembunyikan dari pengguna */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="nama" className="mb-1.5 block text-xs font-semibold text-[#153c33]">
          Nama lengkap
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          maxLength={100}
          placeholder="Nama Anda"
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      <div>
        <label htmlFor="telepon" className="mb-1.5 block text-xs font-semibold text-[#153c33]">
          Nomor WhatsApp
        </label>
        <input
          id="telepon"
          name="telepon"
          type="tel"
          required
          maxLength={20}
          placeholder="081234567890"
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#153c33]">
          Email <span className="font-normal text-[#85908b]">(opsional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={150}
          placeholder="nama@email.com"
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      <div>
        <label htmlFor="pesan" className="mb-1.5 block text-xs font-semibold text-[#153c33]">
          Pesan <span className="font-normal text-[#85908b]">(opsional)</span>
        </label>
        <textarea
          id="pesan"
          name="pesan"
          rows={3}
          maxLength={1000}
          placeholder="Ingin tanya soal cara pembayaran, jadwal survei, dll."
          className="w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      {state.status === "error" && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {state.message}
        </p>
      )}

      <TombolKirim />

      <p className="text-center text-[11px] leading-5 text-[#85908b]">
        Data Anda hanya digunakan untuk menghubungi Anda terkait unit ini.
      </p>
    </form>
  );
}
