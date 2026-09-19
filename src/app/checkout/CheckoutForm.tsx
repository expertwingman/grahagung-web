"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutFormProps = {
  propertySlug: string;
  propertyName: string;
};

export default function CheckoutForm({
  propertySlug,
  propertyName,
}: CheckoutFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    identity: "",
    address: "",
    agreement: false,
  });

  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function handleSubmit() {
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.identity ||
      !form.address
    ) {
      setError("Silakan lengkapi seluruh data pembeli.");
      return;
    }

    if (!form.agreement) {
      setError(
        "Anda harus menyetujui ketentuan pembelian terlebih dahulu."
      );
      return;
    }

    router.push(`/payment?property=${encodeURIComponent(propertySlug)}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-semibold"
        >
          Nama lengkap
        </label>

        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(event) =>
            updateField("fullName", event.target.value)
          }
          placeholder="Masukkan nama lengkap"
          className="w-full rounded-xl border border-black/10 px-4 py-3.5 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder="nama@email.com"
            className="w-full rounded-xl border border-black/10 px-4 py-3.5 text-sm outline-none focus:border-[#153c33]"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold"
          >
            Nomor HP
          </label>

          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder="+62 8xx xxxx xxxx"
            className="w-full rounded-xl border border-black/10 px-4 py-3.5 text-sm outline-none focus:border-[#153c33]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="identity"
          className="mb-2 block text-sm font-semibold"
        >
          NIK / Nomor Passport
        </label>

        <input
          id="identity"
          type="text"
          value={form.identity}
          onChange={(event) =>
            updateField("identity", event.target.value)
          }
          placeholder="Masukkan nomor identitas"
          className="w-full rounded-xl border border-black/10 px-4 py-3.5 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-semibold"
        >
          Alamat
        </label>

        <textarea
          id="address"
          rows={4}
          value={form.address}
          onChange={(event) =>
            updateField("address", event.target.value)
          }
          placeholder="Masukkan alamat lengkap"
          className="w-full resize-none rounded-xl border border-black/10 px-4 py-3.5 text-sm outline-none focus:border-[#153c33]"
        />
      </div>

      <div className="rounded-2xl border border-[#d9d6c8] bg-[#faf8f0] p-5">
        <label className="flex items-start gap-3 text-sm leading-6 text-[#65736e]">
          <input
            type="checkbox"
            checked={form.agreement}
            onChange={(event) =>
              updateField("agreement", event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-[#153c33]"
          />

          <span>
            Saya telah memeriksa data pembelian dan menyetujui
            syarat dan ketentuan pembelian properti.
          </span>
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-full bg-[#153c33] px-6 py-4 text-sm font-bold text-white hover:bg-[#285a4d]"
      >
        LANJUTKAN KE PEMBAYARAN
      </button>

      <p className="text-center text-xs leading-5 text-[#85908b]">
        Unit: {propertyName}
      </p>
    </div>
  );
}
