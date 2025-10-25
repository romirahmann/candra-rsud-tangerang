/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";

export function DeleteModal({ itemName = "data", onClose, onDelete }) {
  return (
    <motion.div
      className="p-6 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Ikon animasi */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className=" w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaTrashAlt className="text-red-600 text-4xl" />
        </motion.div>
      </motion.div>

      {/* Judul */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Hapus {itemName}?
      </h2>

      {/* Deskripsi */}
      <p className="text-gray-600 mb-6 max-w-sm">
        Apakah Anda yakin ingin menghapus <strong>{itemName}</strong>? Tindakan
        ini tidak dapat dibatalkan.
      </p>

      {/* Tombol Aksi */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Batal
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition"
        >
          Hapus
        </motion.button>
      </div>
    </motion.div>
  );
}
