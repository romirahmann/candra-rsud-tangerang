/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaSearch, FaFileExcel } from "react-icons/fa";
import { Table } from "../../../shared/Table";
import api from "../../../services/axios.service";
import { listenToUpdate } from "../../../services/socket.service";
import dayjs from "dayjs";
import { CandraModal } from "../../../components/main/candra/CandraModal";

export function CandraPage() {
  const [candraList, setCandraList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    data: null,
  });

  // ✅ Fetch Data
  const fetchCandra = useCallback(async () => {
    try {
      const res = await api.get("/master/candras");
      setCandraList(res.data?.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
    }
  }, []);

  // ✅ Mount Fetch + Socket Listener
  useEffect(() => {
    fetchCandra();

    const events = [
      "candra_created",
      "candra_updated",
      "candra_deleted",
      "candra_finished",
      "candra_finished_process",
    ];
    events.forEach((event) => listenToUpdate(event, fetchCandra));
  }, [fetchCandra]);

  // ✅ Filter Data
  const filteredCandra = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return candraList;

    return candraList.filter((item) =>
      [
        "kode_checklist",
        "nama_proses",
        "nama_karyawan",
        "idproses",
        "nik",
      ].some((key) => item[key]?.toLowerCase().includes(q))
    );
  }, [searchQuery, candraList]);

  // ✅ Kolom Table
  const columns = useMemo(
    () => [
      { header: "Kode Checklist", key: "kode_checklist" },
      { header: "ID Proses", key: "idproses" },
      { header: "NIK", key: "nik" },
      { header: "QTY Image", key: "qty_image" },
      { header: "Nama Proses", key: "nama_proses" },
      { header: "Nama Karyawan", key: "nama_karyawan" },
      {
        header: "Tanggal",
        key: "tanggal",
        render: (val) =>
          dayjs(val, "YYYY-MM-DD HH:mm:ss").isValid()
            ? dayjs(val).format("DD-MM-YYYY")
            : "-",
      },
      { header: "Mulai", key: "mulai_formatted" },
      { header: "Selesai", key: "selesai_formatted" },
    ],
    []
  );

  // ✅ Export Excel via Backend
  const handleExportExcel = async () => {
    try {
      const res = await api.post(`/master/export-candra`, candraList, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateNow = dayjs().format("YYYYMMDD_HHmmss");

      link.href = url;
      link.download = `data_CANDRA_${dateNow}.xlsx`;
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Error saat mendownload Excel:", error);
    }
  };

  // ✅ Handle Modal Open
  const openModal = (type, title, data = null) =>
    setModal({ isOpen: true, type, title, data });

  // ✅ Handle Modal Close
  const closeModal = () =>
    setModal({ isOpen: false, type: "", title: "", data: null });

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MONITORING CANDRA</h1>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
          >
            <FaFileExcel /> Export Excel
          </button>
        </div>
      </div>

      {/* Table Component */}
      <Table
        columns={columns}
        data={filteredCandra}
        rowsPerPage={8}
        actionRenderer={(item) => (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => openModal("EDIT", "Edit Data Candra", item)}
              className="text-yellow-600 hover:text-yellow-800 transition"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => openModal("DELETE", "Hapus Data Candra", item)}
              className="text-red-600 hover:text-red-800 transition"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        )}
      />

      {/* Modal */}
      <CandraModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        data={modal.data}
        onClose={closeModal}
      />
    </div>
  );
}
