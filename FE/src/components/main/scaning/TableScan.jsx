/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import dayjs from "dayjs";
import api from "../../../services/axios.service";
import { Modal } from "../../../shared/Modal";

export function TableScan({ data = [], selectedProses, onAlert }) {
  const { user } = useSelector((state) => state.auth);
  const [prosesList, setProsesList] = useState([]);
  const [selectedProsesId, setSelectedProsesId] = useState(
    sessionStorage.getItem("idproses") || "ALL"
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modal, setModal] = useState({ open: false, title: "", data: null });
  const [qty, setQty] = useState("");
  const qtyRef = useRef(null);

  // 🔹 Fetch master proses (cache in memory)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/master/prosess");

        if (mounted) setProsesList(res.data.data || []);
      } catch (err) {
        console.error("Error fetching proses:", err);
      }
    })();
    return () => (mounted = false);
  }, []);

  // 🔹 Handle filter proses
  const handleFilterChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSelectedProsesId(value);
      sessionStorage.setItem("idproses", value);
      selectedProses?.(value);
    },
    [selectedProses]
  );

  // 🔹 Handle selesai proses
  const handleSelesai = useCallback(
    async (row) => {
      const timestamp = dayjs().format("HH:mm:ss");
      const payload = {
        ...row,
        editBy: user.username,
        selesai_formatted: timestamp,
      };
      try {
        await api.put(
          `/master/finish-proses/${row.kode_checklist}/${row.idproses}`,
          payload
        );

        onAlert?.(`${row.kode_checklist} telah selesai dikerjakan!`);
      } catch (err) {
        console.error(err);
      }
    },
    [user, onAlert]
  );

  // 🔹 Submit Qty
  const handleSubmitQty = useCallback(
    async (e) => {
      e.preventDefault();
      const row = modal.data;
      try {
        await api.put(
          `/master/finish-proses-scan/${row.kode_checklist}/${row.idproses}`,
          { qty_image: Number(qty) }
        );

        setModal({ open: false, title: "", data: null });
        setQty("");
        onAlert?.("Berhasil menambahkan qty!");
      } catch (err) {
        console.error(err);
      }
    },
    [qty, user, modal, onAlert]
  );

  // 🔹 Render rows (memoized)
  const rows = useMemo(() => {
    const filtered =
      selectedProsesId === "ALL"
        ? data
        : data.filter(
            (item) => String(item.idproses) === String(selectedProsesId)
          );

    return filtered.slice(0, rowsPerPage);
  }, [data, selectedProsesId, rowsPerPage]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold text-gray-800">📄 Data Scan</h2>
          <div className="flex items-center gap-3 text-sm">
            <label>Show:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border rounded-lg px-2 py-1"
            >
              {[10, 20, 50, 100].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            <label>ID Proses:</label>
            <select
              value={selectedProsesId}
              onChange={handleFilterChange}
              className="border rounded-lg px-2 py-1"
            >
              <option value="ALL">All</option>
              {prosesList.map((p) => (
                <option key={p.idproses} value={p.idproses}>
                  {p.idproses}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔹 Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Kode Checklist</th>
                <th className="px-4 py-3">ID Proses</th>
                <th className="px-4 py-3">Nama Proses</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Mulai</th>
                <th className="px-4 py-3">Selesai</th>
                <th className="px-4 py-3 text-center">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-2">{row.kode_checklist}</td>
                    <td className="px-4 py-2">{row.idproses}</td>
                    <td className="px-4 py-2">{row.nama_proses}</td>
                    <td className="px-4 py-2">{row.nama_karyawan}</td>
                    <td className="px-4 py-2">{row.mulai_formatted}</td>
                    <td className="px-4 py-2">
                      {row.selesai_formatted === "00:00:00" ? (
                        <button
                          onClick={() => {
                            if (row.idproses === "1003") {
                              setModal({
                                open: true,
                                title: "Input QTY Proses Scan",
                                data: row,
                              });
                            } else {
                              handleSelesai(row);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
                        >
                          {row.idproses === "1003" ? "Input Qty" : "Selesai"}
                        </button>
                      ) : (
                        <span className="text-green-700 font-medium">
                          {row.selesai_formatted}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {row.qty_image > 0 ? row.qty_image : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal Input Qty */}
      <Modal
        isOpen={modal.open}
        title={modal.title}
        onClose={() => setModal({ open: false, title: "", data: null })}
      >
        {modal.data && (
          <form onSubmit={handleSubmitQty} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Checklist
              </label>
              <input
                type="text"
                value={modal.data.kode_checklist}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Proses
              </label>
              <input
                type="text"
                value={modal.data.idproses}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Qty Images
              </label>
              <input
                ref={qtyRef}
                type="number"
                name="qty_image"
                min={0}
                required
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
