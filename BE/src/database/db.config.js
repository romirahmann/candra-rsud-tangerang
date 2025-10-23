const odbc = require("odbc");
require("dotenv").config();

const dbDataPath = process.env.DB_PATH;
const dbPassword = process.env.DB_PASSWORD || "adi121711";

let db = null;
let isConnecting = false;

// 🧠 Gunakan Mode=Share Deny None biar cepat dan tidak lock antar proses
const buildConnStr = () => {
  let conn = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataPath};Mode=Share Deny None;`;
  if (dbPassword) conn += `PWD=${dbPassword};`;
  return conn;
};

// 🔁 Fungsi koneksi (singleton + auto-reconnect)
async function connectDB() {
  if (db) return db; // sudah terhubung
  if (isConnecting) {
    // kalau sedang connect, tunggu saja
    await new Promise((r) => setTimeout(r, 500));
    return db;
  }

  isConnecting = true;
  try {
    const connStr = buildConnStr();
    db = await odbc.connect(connStr);
    console.log("✅ Access DB connected successfully!");
    return db;
  } catch (error) {
    console.error("❌ Failed to connect MDB:", error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
}

// 🔁 Auto-reconnect jika connection lost
async function getDB() {
  try {
    if (!db) return await connectDB();
    // test query ringan untuk validasi koneksi
    await db.query("SELECT 1");
    return db;
  } catch {
    console.warn("⚠️ Connection lost, reconnecting...");
    db = null;
    return await connectDB();
  }
}

// 🧹 Tutup koneksi saat server mati
async function closeDB() {
  if (db) {
    try {
      await db.close();
      console.log("🔒 Database connection closed cleanly.");
    } catch (err) {
      console.error("❌ Error closing DB:", err.message);
    } finally {
      db = null;
    }
  }
}

// Tangani shutdown otomatis
process.on("SIGINT", closeDB);
process.on("SIGTERM", closeDB);

module.exports = { connectDB, getDB, closeDB };
