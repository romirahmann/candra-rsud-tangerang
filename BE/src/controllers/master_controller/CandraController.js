const model = require("../../models/candra.model");
const modelProses = require("../../models/proses.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
// const moment = require("moment"); // ❌ HAPUS moment
const logService = require("../../services/log.service");
const ExcelJS = require("exceljs");
const { getIO } = require("../../services/socket.service");

// 🔹 Helper date native function
function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", { hour12: false }); // "HH:mm:ss"
}

function subtractDays(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
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

    if (data.idproses === "1009") {
      await model.createCandraFromScan(data);
      const io = getIO();
      io.emit("scan_created", { message: "SCAN NEW CREATED!" });
      return api.ok(res, "Candra created successfully");
    }

    const dataProses = await modelProses.getProsesById(data.idproses);
    const urutanProses = parseInt(dataProses.urutan, 10);

    if (urutanProses === 1) {
      await model.createCandraFromScan(data);
      const io = getIO();
      io.emit("scan_created", { message: "SCAN NEW CREATED!" });
      return api.ok(res, "Candra created successfully");
    }

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
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const updated = await model.finishedProses(kode_checklist, idproses, data);
    if (!updated) return api.error(res, "Candra not found or no changes", 404);

    const io = getIO();
    io.emit("finished_process", {
      message: `Checklist ${kode_checklist} dengan proses ${idproses} selesai!`,
    });

    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};

const finishedProsesScan = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  if (data.qty_image === 0) return api.error(res, "Qty Image can't 0", 400);

  // ✅ Ganti moment dengan native Date
  data.selesai_formatted = formatTime();

  try {
    const updated = await model.finishedProsesScan(
      kode_checklist,
      idproses,
      data
    );
    if (!updated) return api.error(res, "Candra not found or no changes", 404);
    return api.ok(res, "Proses Scan selesai");
  } catch (error) {
    return api.error(res, "Failed to update proses scan", 500);
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
    // ✅ Ganti moment dengan native Date
    const sixDaysAgo = subtractDays(6);

    const dataCandra = await model.getCandraByDate1001(sixDaysAgo);

    if (!dataCandra || dataCandra.length === 0) {
      return api.ok(res, []);
    }

    const kodeChecklistList = dataCandra.map((item) => item.kode_checklist);
    const data = await model.getCandraFilterByKode(kodeChecklistList);

    const dataMap = {};
    data.forEach((item) => {
      if (!dataMap[item.kode_checklist]) dataMap[item.kode_checklist] = [];
      dataMap[item.kode_checklist].push(item);
    });

    if (!prosesMapCache) {
      const prosesData = await modelProses.getAllProses();
      prosesMapCache = {};
      prosesData.forEach((p) => {
        prosesMapCache[String(p.idproses).trim()] = p.nama_proses;
      });
    }

    const targetProses = ["1004", "1005", "1006", "1007"];
    const hasil = [];

    kodeChecklistList.forEach((kode) => {
      const prosesPerChecklist = dataMap[kode] || [];
      const prosesBermasalah = targetProses
        .map((id) => {
          const item = prosesPerChecklist.find(
            (p) => String(p.idproses).trim() === String(id).trim()
          );
          const selesai = item?.selesai?.trim();
          if (!item || !selesai || selesai === "00:00:00") {
            return {
              idproses: id,
              nama_proses:
                item?.nama_proses || prosesMapCache[id] || `Proses ${id}`,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (prosesBermasalah.length > 0) {
        hasil.push({
          kode_checklist: kode,
          proses: prosesBermasalah,
        });
      }
    });

    return api.ok(res, hasil);
  } catch (err) {
    console.error(err);
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
