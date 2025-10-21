// ==========================
// Refactor tanpa moment.js
// ==========================

const { getDB } = require("../database/db.config");

/* =========================
 * Helpers (aman & konsisten)
 * ========================= */

const escapeString = (str) =>
  str === null || str === undefined ? "" : String(str).replace(/'/g, "''");

// format #MM/DD/YYYY# untuk Access
const toAccessDate = (dateLike) => {
  if (!dateLike) return "NULL";
  try {
    const d = new Date(dateLike);
    if (isNaN(d)) return "NULL";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `#${mm}/${dd}/${yyyy}#`;
  } catch {
    return "NULL";
  }
};

// format #HH:mm:ss# untuk Access
const toAccessTime = (timeLike) => {
  if (!timeLike) return "NULL";
  try {
    const d = new Date(
      `1970-01-01T${timeLike.length === 8 ? timeLike : "00:00:00"}`
    );
    if (isNaN(d)) return "NULL";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `#${hh}:${mm}:${ss}#`;
  } catch {
    return "NULL";
  }
};

// ubah string time jadi 'HH:mm:ss'
const formatTime = (timeLike) => {
  if (!timeLike) return null;
  try {
    const d = new Date(timeLike);
    if (isNaN(d)) return null;
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  } catch {
    return null;
  }
};

const toInt = (val, def = 0) => {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : def;
};

/* =========================
 * Queries
 * ========================= */

const getAllCandra = async () => {
  const db = getDB();
  const query = `
    SELECT 
      id,
      kode_checklist, 
      idproses, 
      nik, 
      qty_image, 
      nama_proses, 
      nama_karyawan, 
      tanggal, 
      mulai, 
      selesai
    FROM tblcandra
  `;
  const rows = await db.query(query);

  return rows.map((row) => ({
    ...row,
    mulai_formatted: formatTime(row.mulai),
    selesai_formatted: formatTime(row.selesai),
  }));
};

const getCandraByChecklist = async (Kode_Checklist) => {
  const db = getDB();
  const safeKode = escapeString(Kode_Checklist);

  const query = `
    SELECT 
      id,
      kode_checklist, 
      idproses, 
      nik, 
      qty_image, 
      nama_proses, 
      nama_karyawan, 
      tanggal, 
      mulai, 
      selesai
    FROM tblcandra 
    WHERE kode_checklist = '${safeKode}'
  `;

  const rows = await db.query(query);
  return rows.map((row) => ({
    ...row,
    mulai_formatted: formatTime(row.mulai),
    selesai_formatted: formatTime(row.selesai),
  }));
};

const dataExisting = async (kode_checklist, idproses) => {
  const db = getDB();
  const query = `
    SELECT COUNT(*) AS cnt
    FROM tblcandra
    WHERE kode_checklist = '${escapeString(kode_checklist)}'
      AND idproses = '${escapeString(idproses)}'
  `;
  const result = await db.query(query);
  return (result[0]?.cnt || 0) > 0;
};

const getAllByDateNow = async () => {
  const db = getDB();
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();
  const formattedToday = `${mm}/${dd}/${yyyy}`;

  const query = `
    SELECT 
      id,
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
      editby
    FROM tblcandra
    WHERE tanggal = #${formattedToday}#
    ORDER BY 
      IIF(selesai IS NULL OR selesai = #00:00:00#, 0, 1),
      mulai DESC
  `;

  const rows = await db.query(query);
  return rows.map((row) => ({
    ...row,
    mulai_formatted: formatTime(row.mulai),
    selesai_formatted: formatTime(row.selesai),
  }));
};

const getCandraByKeys = async (kode_checklist, idproses) => {
  const db = getDB();
  const query = `
    SELECT *
    FROM tblcandra
    WHERE kode_checklist = '${escapeString(kode_checklist)}'
      AND idproses = '${escapeString(idproses)}'
  `;
  const result = await db.query(query);
  return result.length > 0 ? result[0] : null;
};

const getAllKeys = async () => {
  const db = getDB();
  const query = `SELECT kode_checklist, idproses FROM tblcandra`;
  return await db.query(query);
};

const createCandra = async (data) => {
  const db = getDB();
  const {
    kode_checklist,
    idproses,
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai_formatted,
    selesai_formatted,
    submittedby,
  } = data;

  const q = `
    INSERT INTO tblcandra (
      kode_checklist, idproses, nik, qty_image, nama_proses, nama_karyawan,
      tanggal, mulai, selesai, submittedby
    ) VALUES (
      '${escapeString(kode_checklist)}',
      '${escapeString(idproses)}',
      '${escapeString(nik)}',
      ${toInt(qty_image, 0)},
      '${escapeString(nama_proses)}',
      '${escapeString(nama_karyawan)}',
      ${toAccessDate(tanggal)},
      ${toAccessTime(mulai_formatted)},
      ${toAccessTime(selesai_formatted)},
      '${escapeString(submittedby)}'
    )
  `;
  return await db.query(q);
};

const createCandraFromScan = async (data) => {
  const db = getDB();
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
  } = data;

  const q = `
    INSERT INTO tblcandra (
      kode_checklist, idproses, nik, qty_image, nama_proses, nama_karyawan,
      tanggal, mulai, selesai, submittedby
    ) VALUES (
      '${escapeString(kode_checklist)}',
      '${escapeString(idproses)}',
      '${escapeString(nik)}',
      ${toInt(qty_image, 0)},
      '${escapeString(nama_proses)}',
      '${escapeString(nama_karyawan)}',
      ${toAccessDate(tanggal)},
      ${toAccessTime(mulai)},
      ${toAccessTime(selesai)},
      '${escapeString(submittedby)}'
    )
  `;
  const result = await db.query(q);
  return result.count;
};

const updateCandra = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const {
    nik,
    nama_proses,
    nama_karyawan,
    qty_image,
    tanggal,
    mulai,
    selesai,
    editby,
  } = data;

  const q = `
    UPDATE tblcandra
    SET nik = '${escapeString(nik)}',
        nama_proses = '${escapeString(nama_proses)}',
        nama_karyawan = '${escapeString(nama_karyawan)}',
        tanggal = ${toAccessDate(tanggal)},
        mulai = ${toAccessTime(mulai)},
        qty_image = ${toInt(qty_image, 0)},
        selesai = ${toAccessTime(selesai)},
        editby = '${escapeString(editby)}'
    WHERE kode_checklist = '${escapeString(kode_checklist)}'
      AND idproses = '${escapeString(idproses)}'
  `;
  const result = await db.query(q);
  return result.count;
};

const finishedProses = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const { selesai_formatted } = data;
  const q = `
    UPDATE tblcandra
    SET selesai = ${toAccessTime(selesai_formatted)}
    WHERE kode_checklist = '${escapeString(kode_checklist)}'
      AND idproses = '${escapeString(idproses)}'
  `;
  const result = await db.query(q);
  return result.count;
};

const finishedProsesScan = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const { selesai_formatted, qty_image } = data;
  const q = `
    UPDATE tblcandra
    SET selesai = ${toAccessTime(selesai_formatted)},
        qty_image = ${toInt(qty_image, 0)}
    WHERE kode_checklist = '${escapeString(kode_checklist)}'
      AND idproses = '${escapeString(idproses)}'
  `;
  const result = await db.query(q);
  return result.count;
};

const updateCandraByMR = async (data) => {
  const db = getDB();
  let { Kode_Checklist, totalPages } = data;
  const qty = toInt(totalPages, 0);
  const q = `
    UPDATE tblcandra
    SET qty_image = ${qty}
    WHERE kode_checklist = '${escapeString(Kode_Checklist)}'
      AND idproses = '1001'
  `;
  return await db.query(q);
};

const deleteCandra = async (id) => {
  const db = getDB();
  const numId = toInt(id, null);
  if (numId === null) throw new Error("Invalid id untuk deleteCandra");
  const q = `DELETE FROM tblcandra WHERE id = ${numId}`;
  const result = await db.query(q);
  return result.count;
};

const getCandraByDate1001 = async (date) => {
  const db = getDB();
  const d = new Date(date);
  if (isNaN(d)) throw new Error("Tanggal tidak valid (getCandraByDate1001)");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();

  const q = `
    SELECT kode_checklist
    FROM tblcandra
    WHERE idproses = '1001'
      AND tanggal < #${mm}/${dd}/${yyyy}#
  `;
  return await db.query(q);
};

const getCandraFilterByKode = async (kodeList = []) => {
  const db = getDB();
  if (!Array.isArray(kodeList) || kodeList.length === 0) return [];

  const inClause = kodeList.map((k) => `'${escapeString(k)}'`).join(",");

  const q = `
    SELECT 
      c.kode_checklist,
      c.idproses,
      p.nama_proses,
      c.selesai
    FROM tblcandra c
    LEFT JOIN tblproses p ON c.idproses = p.idproses
    WHERE c.kode_checklist IN (${inClause})
  `;

  const rows = await db.query(q);
  return rows.map((row) => ({
    ...row,
    selesai_formatted: formatTime(row.selesai),
  }));
};

/* =========================
 * Exports
 * ========================= */
module.exports = {
  getAllCandra,
  getCandraByChecklist,
  dataExisting,
  getAllByDateNow,
  getCandraByKeys,
  getAllKeys,
  createCandra,
  createCandraFromScan,
  updateCandra,
  finishedProses,
  finishedProsesScan,
  updateCandraByMR,
  deleteCandra,
  getCandraByDate1001,
  getCandraFilterByKode,
};
