/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

export function FormEditProses({ initialData = {}, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    idproses: "",
    nama_proses: "",
    urutan: "",
    trn_date: dayjs().format("YYYY-MM-DD"),
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        idproses: initialData.idproses ?? "",
        nama_proses: initialData.nama_proses ?? "",
        urutan: initialData.urutan ?? "",
        trn_date: initialData.trn_date ?? dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      {/* ID Proses */}
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
          value={formData.idproses || ""}
          onChange={handleChange}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* Nama Proses */}
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
          value={formData.nama_proses || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          placeholder="Masukkan nama proses"
          required
        />
      </div>

      {/* Urutan */}
      <div>
        <label
          htmlFor="urutan"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Urutan
        </label>
        <input
          id="urutan"
          name="urutan"
          type="number"
          value={formData.urutan || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          placeholder="Masukkan urutan proses"
          required
        />
      </div>

      {/* Tanggal Transaksi */}
      <div>
        <label
          htmlFor="trn_date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tanggal Transaksi
        </label>
        <input
          id="trn_date"
          name="trn_date"
          type="date"
          value={formData.trn_date || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Batal
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
