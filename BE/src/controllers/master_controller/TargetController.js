const model = require("../../models/target.model");
const api = require("../../tools/common");
const { getIO } = require("../../services/socket.service");

const getAllTargets = async (req, res) => {
  try {
    const data = await model.getAllTargets();

    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting targets:", error);
    return api.error(res, "Failed to get targets", 500);
  }
};

const getTargetFilter = async (req, res) => {
  const { query } = req.params;
  try {
    const targets = await model.getAllTargets(query);
    return api.ok(res, targets);
  } catch (error) {
    console.error("❌ Error fetching targets:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getTargetById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const data = await model.getTargetById(id);
    if (!data) {
      return api.error(res, "Target not found", 404);
    }

    const io = getIO();
    io.emit("target_viewed", { id, message: "Target fetched successfully" });

    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting target by ID:", error);
    return api.error(res, "Failed to get target", 500);
  }
};

const createTarget = async (req, res) => {
  const { nama, nilai } = req.body;

  if (!nama || !nilai) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const newTarget = await model.createTarget({ nama, nilai });
    const io = getIO();
    io.emit("target_created", newTarget);
    return api.ok(res, {
      message: "Target successfully added",
      data: newTarget,
    });
  } catch (error) {
    console.error("❌ Error creating target:", error);
    return api.error(res, "Failed to add target", 500);
  }
};

const updateTarget = async (req, res) => {
  const { id } = req.params;
  const { nama, nilai } = req.body;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }
  if (!nama || !nilai) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.updateTarget(id, { nama, nilai });
    const io = getIO();
    io.emit("target_updated", { id, nama, nilai });
    return api.ok(res, "Target successfully updated");
  } catch (error) {
    console.error("❌ Error updating target:", error);
    return api.error(res, "Failed to update target", 500);
  }
};

const deleteTarget = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const result = await model.deleteTarget(id);
    const io = getIO();
    io.emit("target_deleted", { id });
    return api.ok(res, "Target successfully deleted");
  } catch (error) {
    console.error("❌ Error deleting target:", error);
    return api.error(res, "Failed to delete target", 500);
  }
};

module.exports = {
  getAllTargets,
  getTargetById,
  createTarget,
  updateTarget,
  deleteTarget,
  getTargetFilter,
};
