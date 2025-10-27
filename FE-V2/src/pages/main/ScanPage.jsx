/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { MdDocumentScanner } from "react-icons/md";
import { FormScan } from "../../components/main/scaning/FormScan";
import { TableScan } from "../../components/main/scaning/TableScan";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { LoadingScreen } from "../../shared/LoadingScreen";
import { listenToUpdate } from "../../services/socket.service";

export function ScanPage() {
  const [dataScan, setDataScan] = useState([]);
  const [filterProses, setFilterProses] = useState(
    sessionStorage.getItem("idproses") || "ALL"
  );
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // 🔹 Fetch data scanning (with filtering)
  const fetchDataScan = useCallback(async () => {
    try {
      const res = await api.get("/master/candra-now");
      const allData = res.data?.data || [];

      setDataScan(
        filterProses === "ALL"
          ? allData
          : allData.filter((item) => item.idproses === filterProses)
      );
    } catch (error) {
      console.error("Fetch scanning error:", error);
      setAlert({
        show: true,
        type: "warning",
        message: "Gagal mengambil data dari server",
      });
    } finally {
      setLoading(false);
    }
  }, [filterProses]);

  useEffect(() => {
    fetchDataScan();

    const events = [
      "candra_created",
      "candra_updated",
      "candra_deleted",
      "candra_finished",
      "candra_finished_process",
      "scan_created",
    ];
    events.forEach((event) => listenToUpdate(event, fetchDataScan));
  }, [fetchDataScan]);

  // 🔹 Run once + refetch when filter changes
  useEffect(() => {
    fetchDataScan();
  }, [fetchDataScan]);

  // 🔹 Handler proses terpilih
  const handleSelectedProses = useCallback((val) => {
    sessionStorage.setItem("idproses", val);
    setFilterProses(val);
  }, []);

  // 🔹 Handler alert success (create/update/remove)
  const handleAlert = useCallback(
    (msg) => {
      setAlert({ show: true, type: "success", message: msg });
      fetchDataScan();
    },
    [fetchDataScan]
  );

  // 🔹 Handler loading perubahan dari FormScan
  const handleLoading = useCallback((val) => setLoading(val), []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-3">
              <MdDocumentScanner className="text-3xl text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                Scanning Proses
              </h1>
            </div>
            <div className="mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Cari data..."
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left - Form */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <FormScan onAdd={handleAlert} onLoadingChange={handleLoading} />
            </div>

            {/* Right - Table */}
            <div className="col-span-1 lg:col-span-3 bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-200 hover:shadow-lg">
              <TableScan
                data={dataScan}
                selectedProses={handleSelectedProses}
                onAlert={handleAlert}
              />
            </div>
          </div>
        </div>
      )}

      {/* Alert Message */}
      {alert.show && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}
    </>
  );
}
