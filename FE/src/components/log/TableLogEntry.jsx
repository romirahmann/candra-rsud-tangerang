/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";

export function TableLogEntry({ data = "", filter = {} }) {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "waktu", dir: "desc" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(filter.perPage || 10);

  // 🧩 Parsing log text ke array object
  useEffect(() => {
    if (!data) return;

    let textData = "";

    // Kalau data sudah array of string → gabungkan dengan newline
    if (Array.isArray(data)) {
      if (typeof data[0] === "object") {
        // Kalau sudah array of object → langsung set
        setLogs(data);
        return;
      }
      textData = data.join("\n");
    } else if (typeof data === "string") {
      textData = data;
    } else {
      console.warn("⚠️ Format data tidak dikenali:", data);
      return;
    }

    const parsed = textData
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        // contoh log: 2025-10-18 08:56:36 | Counter: 250917-0002 | NoPBL: 1 | Label: KURNIAWATI | Keterangan: Data tersimpan
        const [datetime, ...parts] = line.split(" | ");
        const obj = { waktu: datetime };

        parts.forEach((part) => {
          const [key, value] = part.split(":").map((v) => v.trim());
          if (key && value) obj[key.toLowerCase()] = value;
        });

        return obj;
      });

    setLogs(parsed);
  }, [data]);

  const columns = [
    { header: "Waktu", key: "waktu" },
    { header: "Counter", key: "counter" },
    { header: "No PBL", key: "nopbl" },
    { header: "Label", key: "label" },
    { header: "Keterangan", key: "keterangan" },
  ];

  // 🔍 Filter pencarian
  const filteredData = useMemo(() => {
    if (!query) return logs;
    const q = query.toLowerCase();
    return logs.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [query, logs]);

  // 🔽 Sorting
  const sortedData = useMemo(() => {
    const arr = [...filteredData];
    const { key, dir } = sortBy;
    arr.sort((a, b) => {
      const va = a[key] ?? "";
      const vb = b[key] ?? "";
      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [filteredData, sortBy]);

  // 📄 Pagination
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const visibleData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const changeSort = (key) => {
    if (sortBy.key === key) {
      setSortBy({ key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
    } else {
      setSortBy({ key, dir: "asc" });
    }
  };

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Log Entry</h2>
        <input
          type="text"
          placeholder="Cari log..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => changeSort(col.key)}
                  className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    <span className="text-gray-400">
                      {sortBy.key === col.key
                        ? sortBy.dir === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {visibleData.length > 0 ? (
              visibleData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-gray-700 whitespace-nowrap"
                    >
                      {row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Menampilkan{" "}
          <span className="font-semibold">
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalRows)}
          </span>{" "}
          dari <span className="font-semibold">{totalRows}</span> data
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 border rounded-md ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          <span>
            {page} / {totalPages || 1}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 border rounded-md ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
