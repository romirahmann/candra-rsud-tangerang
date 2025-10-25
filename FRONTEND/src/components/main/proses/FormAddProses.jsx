/* eslint-disable no-unused-vars */
import { useState } from "react";

import { AlertMessage } from "../../../shared/AlertMessage";
import dayjs from "dayjs";

export function FormAddProses({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    idproses: "",
    nama_proses: "",
    urutan: 0,
    trn_date: dayjs().format("YYYY-MM-DD"),
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onAdd(formData);
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal menambahkan proses!",
        type: "error",
      });
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* ID Proses */}
        <div className="flex flex-col">
          <label
            htmlFor="idproses"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            ID Proses
          </label>
          <input
            type="text"
            id="idproses"
            name="idproses"
            value={formData.idproses}
            onChange={handleChange}
            required
            placeholder="Masukkan ID proses"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
          />
        </div>

        {/* Nama Proses */}
        <div className="flex flex-col">
          <label
            htmlFor="nama_proses"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Nama Proses
          </label>
          <input
            type="text"
            id="nama_proses"
            name="nama_proses"
            value={formData.nama_proses}
            onChange={handleChange}
            required
            placeholder="Masukkan nama proses"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
          />
        </div>

        {/* Urutan */}
        <div className="flex flex-col">
          <label
            htmlFor="urutan"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Urutan
          </label>
          <input
            type="number"
            id="urutan"
            name="urutan"
            value={formData.urutan}
            onChange={handleChange}
            required
            placeholder="Masukkan urutan proses"
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
            Simpan Proses
          </button>
        </div>
      </form>

      {/* Alert */}
      {alert.show && (
        <div className="pt-4">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() =>
              setAlert({
                show: false,
                message: "",
                type: "",
              })
            }
          />
        </div>
      )}
    </>
  );
}
