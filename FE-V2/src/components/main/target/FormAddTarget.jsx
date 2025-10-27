/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAlert } from "../../../store/AlertContext";

export function FormAddTarget({ onAdd, onClose }) {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    nama: "",
    nilai: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* Nama Target */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Nama Target
        </label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          required
          placeholder="Masukkan nama target"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
        />
      </div>

      {/* Nilai */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Nilai</label>
        <input
          type="number"
          name="nilai"
          value={formData.nilai}
          onChange={handleChange}
          required
          placeholder="Masukkan nilai target"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 active:scale-95 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 active:scale-95 transition"
        >
          Save Target
        </button>
      </div>
    </form>
  );
}
