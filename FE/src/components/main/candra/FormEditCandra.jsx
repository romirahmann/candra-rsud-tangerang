/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export function FormEditCandra({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    kode_checklist: "",
    idproses: "",
    nik: "",
    qty_image: 0,
    nama_proses: "",
    nama_karyawan: "",
    tanggal: "",
    mulai: "",
    selesai: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Set initial data saat modal dibuka
  useEffect(() => {
    if (initialData) {
      setFormData({
        kode_checklist: initialData.kode_checklist || "",
        idproses: initialData.idproses || "",
        nik: initialData.nik || "",
        qty_image: initialData.qty_image || 0,
        nama_proses: initialData.nama_proses || "",
        nama_karyawan: initialData.nama_karyawan || "",
        tanggal: initialData.tanggal
          ? dayjs(initialData.tanggal).format("YYYY-MM-DD")
          : "",
        mulai: initialData.mulai_formatted || "",
        selesai: initialData.selesai_formatted || "",
      });
    }
  }, [initialData]);

  // ✅ Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Input Kode Checklist */}
      <div>
        <label
          htmlFor="kode_checklist"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Kode Checklist
        </label>
        <input
          id="kode_checklist"
          name="kode_checklist"
          type="text"
          value={formData.kode_checklist}
          onChange={handleChange}
          className="w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:ring-0  outline-none transition focus:border-none"
          readOnly
        />
      </div>

      {/* Input ID Proses */}
      <div>
        <label
          htmlFor="idproses"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ID Proses
        </label>
        <input
          id="idproses"
          name="idproses"
          type="text"
          value={formData.idproses}
          onChange={handleChange}
          className="w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:ring-0  outline-none transition focus:border-none"
          required
          readOnly
        />
      </div>

      {/* Input NIK */}
      <div>
        <label
          htmlFor="nik"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          NIK
        </label>
        <input
          id="nik"
          name="nik"
          type="text"
          value={formData.nik}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          required
        />
      </div>

      {/* Input QTY Image */}
      <div>
        <label
          htmlFor="qty_image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          QTY Image
        </label>
        <input
          id="qty_image"
          name="qty_image"
          type="number"
          value={formData.qty_image}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          required
        />
      </div>

      {/* Input Nama Proses */}
      <div>
        <label
          htmlFor="nama_proses"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Proses
        </label>
        <input
          id="nama_proses"
          name="nama_proses"
          type="text"
          value={formData.nama_proses}
          onChange={handleChange}
          className="w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:ring-0  outline-none transition focus:border-none"
          readOnly
        />
      </div>

      {/* Input Nama Karyawan */}
      <div>
        <label
          htmlFor="nama_karyawan"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Karyawan
        </label>
        <input
          id="nama_karyawan"
          name="nama_karyawan"
          type="text"
          value={formData.nama_karyawan}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() =>
            setFormData({
              kode_checklist: "",
              idproses: "",
              nik: "",
              qty_image: 0,
              nama_proses: "",
              nama_karyawan: "",
              tanggal: "",
              mulai_formatted: "",
              selesai_formatted: "",
            })
          }
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && (
            <span
              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
