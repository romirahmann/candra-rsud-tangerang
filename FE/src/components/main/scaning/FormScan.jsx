/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import api from "../../../services/axios.service";

import { AlertMessage } from "../../../shared/AlertMessage";
import { useSelector } from "react-redux";

export function FormScan() {
  const kodeRef = useRef(null);
  const idProsesRef = useRef(null);
  const nikRef = useRef(null);
  const qtyRef = useRef(null);

  const [namaProses, setNamaProses] = useState("");
  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const { user } = useSelector((state) => state.auth);
  // cache master data
  const prosesCacheRef = useRef([]);
  const employeeCacheRef = useRef([]);
  const lookupTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [prosesRes, empRes] = await Promise.all([
          api.get("/master/prosess"),
          api.get("/master/employees"),
        ]);
        if (!mounted) return;
        prosesCacheRef.current = prosesRes?.data?.data || [];
        employeeCacheRef.current = empRes?.data?.data || [];
      } catch (err) {
        console.error("Error fetching master data", err);
      }
    })();
    return () => {
      mounted = false;
      clearTimeout(lookupTimerRef.current);
    };
  }, []);

  // helpers
  const findProsesById = useCallback(
    (id) =>
      prosesCacheRef.current.find(
        (p) => String(p.idproses).toLowerCase() === String(id).toLowerCase()
      ),
    []
  );
  const findEmployeeByNik = useCallback(
    (nik) =>
      employeeCacheRef.current.find(
        (e) => String(e.nik).toLowerCase() === String(nik).toLowerCase()
      ),
    []
  );

  const handleDebouncedLookup = useCallback(() => {
    clearTimeout(lookupTimerRef.current);
    lookupTimerRef.current = setTimeout(() => {
      const idVal = idProsesRef.current?.value?.trim();
      const nikVal = nikRef.current?.value?.trim();

      const proses = findProsesById(idVal);
      setNamaProses(proses ? proses.nama_proses : "");

      const karyawan = findEmployeeByNik(nikVal);
      setNamaKaryawan(karyawan ? karyawan.nama_karyawan : "");
    }, 150);
  }, [findProsesById, findEmployeeByNik]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const kode = kodeRef.current?.value?.trim();
      const idproses = idProsesRef.current?.value?.trim();
      const nik = nikRef.current?.value?.trim();
      const qty = Number(qtyRef.current?.value || 0);

      if (!kode || !idproses || !nik) {
        setAlert({
          show: true,
          type: "error",
          message: "Lengkapi semua inputan!",
        });
        return;
      }

      const proses = findProsesById(idproses);
      const employee = findEmployeeByNik(nik);
      if (!proses || !employee) {
        setAlert({
          show: true,
          type: "error",
          message: "ID Proses atau NIK tidak valid!",
        });
        return;
      }

      const payload = {
        kode_checklist: kode,
        idproses,
        nama_proses: proses.nama_proses,
        qty_image: qty,
        nik,
        nama_karyawan: employee.nama_karyawan,
        mulai: dayjs().format("HH:mm:ss"),
        selesai: "00:00:00",
        submittedby: user.username,
        tanggal: dayjs().format("YYYY-MM-DD"),
      };

      try {
        await api.post("/master/add-scan", payload);
        setAlert({
          show: true,
          type: "success",
          message: "Berhasil menambahkan data!",
        });

        // 🧩 Pastikan ref masih ada
        if (kodeRef.current) kodeRef.current.value = "";
        if (qtyRef.current) qtyRef.current.value = 0;

        if (!isLocked) {
          if (idProsesRef.current) idProsesRef.current.value = "";
          if (nikRef.current) nikRef.current.value = "";
          setNamaProses("");
          setNamaKaryawan("");
        }

        // 🧩 Coba fokus ulang hanya jika masih mounted
        setTimeout(() => {
          if (kodeRef.current) kodeRef.current.focus();
        }, 0);
      } catch (err) {
        console.error("submit error", err);
        setAlert({
          show: true,
          type: "error",
          message: "Gagal menambahkan data!",
        });
      }
    },
    [findProsesById, findEmployeeByNik, isLocked]
  );

  const toggleLock = useCallback(() => {
    setIsLocked((s) => !s);
    kodeRef.current?.focus();
  }, []);

  return (
    <div className="col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Scan Mulai
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Kode Checklist
          </label>
          <input
            ref={kodeRef}
            type="text"
            placeholder="Masukkan kode checklist"
            className="w-full placeholder:text-gray-400 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">ID Proses</label>
          <input
            ref={idProsesRef}
            type="text"
            placeholder="Masukkan ID proses"
            className={`w-full placeholder:text-gray-400 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none ${
              isLocked ? "bg-gray-100 focus:ring-0 border-0" : ""
            }`}
            onChange={handleDebouncedLookup}
            required
            readOnly={isLocked}
          />
          <div
            className={`${
              namaProses
                ? "text-sm text-gray-50 bg-green-800 p-1 mt-1"
                : "hidden"
            }`}
          >
            {namaProses}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">NIK</label>
          <input
            ref={nikRef}
            type="text"
            placeholder="Masukkan NIK"
            className={`w-full placeholder:text-gray-400 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none ${
              isLocked ? "bg-gray-100" : ""
            }`}
            onChange={handleDebouncedLookup}
            required
            readOnly={isLocked}
          />
          <div
            className={`${
              namaKaryawan
                ? "text-sm text-gray-50 bg-green-800 p-1 mt-1"
                : "hidden"
            }`}
          >
            {namaKaryawan}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="lock"
            type="checkbox"
            checked={isLocked}
            onChange={toggleLock}
          />
          <label htmlFor="lock" className="text-sm text-gray-600">
            Kunci ID Proses & NIK
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-md"
        >
          Submit
        </button>
      </form>

      {alert.show && (
        <div className="mt-3">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: "", message: "" })}
          />
        </div>
      )}
    </div>
  );
}
