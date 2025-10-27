/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export function FormEditTarget({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    nama: "",
    nilai: 0,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Set initial data saat modal dibuka
  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || "",
        nilai: initialData.nilai || 0,
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
      {/* Input Nama */}
      <div>
        <label
          htmlFor="nama"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Target
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          value={formData.nama}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          placeholder="Masukkan nama target"
          required
        />
      </div>

      {/* Input Nilai */}
      <div>
        <label
          htmlFor="nilai"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nilai
        </label>
        <input
          id="nilai"
          name="nilai"
          type="number"
          value={formData.nilai}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          placeholder="Masukkan nilai target"
          required
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => setFormData({ nama: "", nilai: 0 })}
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
