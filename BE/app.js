require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const path = require("path");
const fs = require("fs");

// Database & services
const { connectDB } = require("./src/database/db.config");
const { connectDB2 } = require("./src/database/update.config");
const mainRoutes = require("./src/routes/routes");
const { init } = require("./src/services/socket.service");

const app = express();
const server = createServer(app);

// Inisialisasi Socket.IO
const io = init(server);

// Middleware
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Endpoint default
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    service: "Backend RSUD Kab. Tangerang is Running",
  });
});

// Routes utama
app.use("/api", mainRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// ✅ Path frontend (handle saat dijalankan dari exe)
let frontendPath;
if (process.pkg) {
  // kalau jalan dari exe → ambil relative ke folder exe
  frontendPath = path.join(path.dirname(process.execPath), "frontend");
} else {
  // kalau jalan dari node biasa → ambil relative project
  frontendPath = path.join(__dirname, "frontend");
}

if (fs.existsSync(frontendPath)) {
  console.log("✅ Serving frontend from:", frontendPath);
  app.use("/candra-rsud-tangerang", express.static(frontendPath));
} else {
  console.warn("⚠️ Frontend folder not found:", frontendPath);
}

// ✅ Global error handler (biar exe nggak langsung close tanpa pesan)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// ✅ Jalankan server setelah DB connect
Promise.all([connectDB(), connectDB2()])
  .then(() => {
    console.log("✅ All Database connections established");

    const PORT = process.env.PORT || 8800;
    const HOST = process.env.HOST || "0.0.0.0";

    server.listen(PORT, HOST, () => {
      console.log(`🚀 Backend is Running on URL: http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });

// Ekspor app dan server jika dibutuhkan
module.exports = { app, server };
