/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Table } from "../../../shared/Table";
import { ProsesModal } from "../../../components/main/proses/ProsesModal";
import api from "../../../services/axios.service";
import { listenToUpdate } from "../../../services/socket.service";

export function ProsesPage() {
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    data: null,
  });

  const [proses, setProses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProses();
  }, []);

  useEffect(() => {
    listenToUpdate("proses_created", fetchProses);
    listenToUpdate("proses_updated", fetchProses);
    listenToUpdate("proses_deleted", fetchProses);
  }, []);

  const fetchProses = async () => {
    try {
      const res = await api.get("/master/prosess");
      setProses(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProses = useMemo(() => {
    if (!searchQuery) return proses;
    return proses.filter(
      (p) =>
        p.nama_proses?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.idproses?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, proses]);

  const columns = [
    { header: "ID Proses", key: "idproses" },
    { header: "Nama Proses", key: "nama_proses" },
    { header: "Urutan", key: "urutan" },
  ];

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MANAJEMEN PROSES</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search proses..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() =>
              setModal({ isOpen: true, type: "ADD", title: "Tambah Proses" })
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-1 md:py-2 px-2 md:px-4 rounded-lg transition-colors text-sm md:text-[1em] lg:text-[1.1em]"
          >
            <FaPlus /> Tambah Proses
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredProses}
        rowsPerPage={5}
        actionRenderer={(proses) => (
          <>
            <button
              onClick={() =>
                setModal({
                  isOpen: true,
                  type: "EDIT",
                  title: "Edit Proses",
                  data: proses,
                })
              }
              className="text-yellow-600 hover:text-yellow-800 transition"
            >
              <FaEdit />
            </button>
            <button
              onClick={() =>
                setModal({
                  isOpen: true,
                  type: "DELETE",
                  title: "Delete Proses",
                  data: proses.id,
                })
              }
              className="text-red-600 hover:text-red-800 transition"
            >
              <FaTrash />
            </button>
          </>
        )}
      />

      {/* Modal */}
      <ProsesModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        data={modal.data}
        onClose={() => setModal({ isOpen: false, type: "", title: "" })}
      />
    </div>
  );
}
