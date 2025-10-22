const fs = require("fs");
const path = require("path");
const api = require("../../tools/common");

// Ubah ke native date
const getCurrentDateTime = () => {
  const now = new Date();
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const LogModel = require("../../models/log.model");

// Path file log
const logFilePath = path.join(__dirname, "../../exports/candra.log");

const getAllLog = async (req, res) => {
  const { query } = req.params;
  try {
    let result = await LogModel.getAllLog(query);
    return api.ok(res, result);
  } catch (error) {
    console.log(error);
    return api.error(res, "GET LOG FAILED", 500);
  }
};

const getByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    let result = await LogModel.getByStatus(status);
    return api.ok(res, result);
  } catch (error) {
    console.log(error);
    return api.error(res, error, 500);
  }
};

// ⬇️ ADD LOG ke file
const addLog = async (req, res) => {
  const newData = req.body;

  try {
    // Format log line
    const logLine = `[${getCurrentDateTime()}] ${JSON.stringify(newData)}\n`;

    // Pastikan folder export ada
    const dirPath = path.dirname(logFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Tulis ke file
    fs.appendFileSync(logFilePath, logLine, "utf8");

    return api.ok(res, "Log saved to file successfully");
  } catch (error) {
    console.error("❌ Error writing log:", error);
    return api.error(res, "Failed to write log file", 500);
  }
};

const viewLogEntry = async (req, res) => {
  try {
    const filePath = "\\\\192.168.9.251\\padaprima\\T2 Data Enty\\log.txt";
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return api.ok(res, data);
    } else {
      console.error("⚠️ File tidak ditemukan di:", filePath);
      return api.error(res, "File tidak ditemukan!", 401);
    }
  } catch (error) {
    console.log(error);
    return api.error(res, "Internal Server Error", 500);
  }
};

module.exports = {
  addLog,
  getAllLog,
  getByStatus,
  viewLogEntry,
};
