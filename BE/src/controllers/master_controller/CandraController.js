const model = require("../../models/candra.model");
const modelProses = require("../../models/proses.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

const ExcelJS = require("exceljs");
const { getIO } = require("../../services/socket.service");

// 🔹 Helper date native function
function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", { hour12: false }); // "HH:mm:ss"
}

function subtractDays(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const getAllCandra = async (req, res) => {
  try {
    const data = await model.getAllCandra();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const getFilterCandra = async (req, res) => {
  let { query } = req.params;

  try {
    let data = await model.getAllCandra(query);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const getAllCandraDayNow = async (req, res) => {
  try {
    const data = await model.getAllByDateNow();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const getCandraByKeys = async (req, res) => {
  let { kode_checklist, idproses } = req.params;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const data = await model.getCandraByKeys(kode_checklist, idproses);
    if (!data) return api.error(res, "Candra data not found", 404);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting Candra by keys:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const createCandra = async (req, res) => {
  const {
    kode_checklist,
    idproses,
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai,
    selesai,
    submittedby,
  } = req.body;

  if (
    !kode_checklist ||
    !idproses ||
    !nik ||
    !qty_image ||
    !nama_proses ||
    !nama_karyawan ||
    !tanggal ||
    !mulai ||
    !selesai ||
    !submittedby
  )
    return api.error(res, "All fields are required", 400);

  try {
    const inserted = await model.createCandra(req.body);
    return api.ok(res, { inserted }, "Candra created successfully");
  } catch (error) {
    console.error("❌ Error creating Candra:", error);
    return api.error(res, "Failed to create Candra", 500);
  }
};

const addScanCandra = async (req, res) => {
  const data = req.body;

  try {
    const existingCandra = await model.dataExisting(
      data.kode_checklist,
      data.idproses
    );

    if (existingCandra) {
      return api.error(
        res,
        `Proses ${data.idproses} dengan Kode Checklist ${data.kode_checklist} sudah ada`,
        400
      );
    }

    const dataProses = await modelProses.getUrutanProsesById(data.idproses);
    const urutanProses = parseInt(dataProses.urutan, 10);

    if (urutanProses === 1) {
      await model.createCandraFromScan(data);
      const io = getIO();
      io.emit("scan_created", { message: "SCAN NEW CREATED!" });
      return api.ok(res, "Candra created successfully");
    }
    console.log(urutanProses);

    const prosesSebelumnya = await modelProses.getProsesByUrutan(
      urutanProses - 1
    );

    if (!prosesSebelumnya || prosesSebelumnya.length === 0) {
      return api.error(
        res,
        `Tidak ditemukan proses dengan urutan sebelumnya (${urutanProses - 1})`,
        400
      );
    }

    const existingPreviousPromises = prosesSebelumnya.map((proses) =>
      model.getCandraByKeys(data.kode_checklist, proses.idproses)
    );
    const finishedPreviousList = await Promise.all(existingPreviousPromises);

    // ✅ Ganti moment dengan native check
    const prosesBelumSelesai = finishedPreviousList.some((finishedPrevious) => {
      if (!finishedPrevious) return true;
      return (
        !finishedPrevious.selesai || finishedPrevious.selesai === "00:00:00"
      );
    });

    if (prosesBelumSelesai) {
      return api.error(res, "Selesaikan proses sebelumnya!", 400);
    }

    await model.createCandraFromScan(data);
    const io = getIO();
    io.emit("scan_created", { message: "SCAN NEW CREATED!" });

    return api.ok(res, "Candra created successfully");
  } catch (error) {
    console.error("❌ Error creating Candra:", error);
    return api.error(res, "Failed to create Candra", 500);
  }
};

const updateCandra = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const updated = await model.updateCandra(kode_checklist, idproses, data);
    if (!updated) return api.error(res, "Candra not found or no changes", 404);
    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};

const finishedProses = async (req, res) => {
  try {
    const { kode_checklist, idproses } = req.params;
    const { selesai_formatted } = req.body;

    if (!kode_checklist || !idproses || !selesai_formatted)
      return api.error(
        res,
        "kode_checklist, idproses, dan waktu selesai wajib diisi",
        400
      );

    // langsung update tanpa pre-check redundant
    const updated = await model.finishedProses(
      kode_checklist,
      idproses,
      selesai_formatted
    );

    if (updated === 0)
      return api.error(res, "Data tidak ditemukan atau tidak berubah", 404);

    getIO().emit("finished_process", {
      message: `Checklist ${kode_checklist} proses ${idproses} selesai!`,
    });

    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};
// ✅ Controller — versi cepat dan clean
const finishedProsesScan = async (req, res) => {
  try {
    const { kode_checklist, idproses } = req.params;
    const { qty_image } = req.body;

    if (!kode_checklist || !idproses)
      return api.error(res, "kode_checklist dan idproses wajib diisi", 400);

    if (!qty_image || qty_image <= 0)
      return api.error(res, "Qty Image tidak boleh 0", 400);

    // native date formatter — langsung di sini
    const selesai_formatted = formatTime();

    // langsung panggil model tanpa ubah string manual
    const updated = await model.finishedProsesScan(
      kode_checklist,
      idproses,
      selesai_formatted,
      qty_image
    );

    if (updated === 0)
      return api.error(res, "Candra tidak ditemukan atau tidak berubah", 404);

    return api.ok(res, "Proses scan selesai");
  } catch (error) {
    console.error("❌ Error finishedProsesScan:", error);
    return api.error(res, "Gagal menyelesaikan proses scan", 500);
  }
};

const deleteCandra = async (req, res) => {
  let { id } = req.params;

  try {
    const deleted = await model.deleteCandra(id);
    if (!deleted) return api.error(res, "Candra not found", 404);
    return api.ok(res, { deleted }, "Candra deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting Candra:", error);
    return api.error(res, "Failed to delete Candra", 500);
  }
};

const exportCsv = async (req, res) => {
  const data = req.body;
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Candra");

    const headers = [
      "Kode Checklist",
      "ID Proses",
      "NIK",
      "Qty Image",
      "Nama Proses",
      "Nama Karyawan",
      "Tanggal",
      "Mulai",
      "Selesai",
      "Submitted By",
    ];
    worksheet.addRow(headers);

    data.forEach((row) => {
      worksheet.addRow([
        row.kode_checklist,
        row.idproses,
        row.nik,
        row.qty_image,
        row.nama_proses,
        row.nama_karyawan,
        row.tanggal,
        row.mulai_formatted,
        row.selesai_formatted,
        row.submittedby,
      ]);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    const filePath = path.join(__dirname, "../../exports/candra_export.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, "data_candra.xlsx", (err) => {
      if (err) {
        console.error("Error saat mengirim file:", err);
        res.status(500).json({ message: "Gagal mengunduh file" });
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("❌ Error exporting Excel:", error);
    return api.error(res, "Failed to export Excel", 500);
  }
};

// Cache map tetap sama
let prosesMapCache = null;

const validate1007 = async (req, res) => {
  try {
    // ✅ Pakai native date helper, langsung dari util kecil
    const sixDaysAgo = subtractDays(6);

    // 1️⃣ Ambil semua checklist yang sudah lebih dari 6 hari
    const dataCandra = await model.getCandraByDate1001(sixDaysAgo);
    if (!dataCandra?.length) return api.ok(res, []);

    // 2️⃣ Kumpulkan kode checklist sekali saja
    const kodeChecklistList = dataCandra.map((r) => r.kode_checklist);

    // 3️⃣ Ambil semua proses dari kode checklist yang ditemukan
    const data = await model.getCandraFilterByKode(kodeChecklistList);
    if (!data?.length) return api.ok(res, []);

    // 4️⃣ Buat map dari kode_checklist ke daftar prosesnya
    const dataMap = Object.create(null);
    for (const item of data) {
      const kode = item.kode_checklist;
      if (!dataMap[kode]) dataMap[kode] = [];
      dataMap[kode].push(item);
    }

    // 5️⃣ Cache nama proses biar nggak query terus
    if (!prosesMapCache) {
      const prosesData = await modelProses.getAllProses();
      prosesMapCache = Object.fromEntries(
        prosesData.map((p) => [String(p.idproses).trim(), p.nama_proses])
      );
    }

    // 6️⃣ Loop target proses dan cari yang bermasalah
    const targetProses = ["1004", "1005", "1006", "1007"];
    const hasil = [];

    for (const kode of kodeChecklistList) {
      const prosesList = dataMap[kode];
      if (!prosesList) continue;

      const prosesLookup = Object.fromEntries(
        prosesList.map((p) => [String(p.idproses).trim(), p])
      );

      const prosesBermasalah = [];
      for (const id of targetProses) {
        const item = prosesLookup[id];
        const selesai = item?.selesai?.trim();
        if (!item || !selesai || selesai === "00:00:00") {
          prosesBermasalah.push({
            idproses: id,
            nama_proses:
              item?.nama_proses || prosesMapCache[id] || `Proses ${id}`,
          });
        }
      }

      if (prosesBermasalah.length > 0) {
        hasil.push({ kode_checklist: kode, proses: prosesBermasalah });
      }
    }

    return api.ok(res, hasil);
  } catch (err) {
    console.error("❌ validate1007 error:", err);
    return api.error(res, "Validate Error", 500);
  }
};

module.exports = {
  getAllCandra,
  getCandraByKeys,
  createCandra,
  updateCandra,
  deleteCandra,
  exportCsv,
  addScanCandra,
  finishedProses,
  getAllCandraDayNow,
  finishedProsesScan,
  validate1007,
  getFilterCandra,
};
