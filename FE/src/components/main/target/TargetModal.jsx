/* eslint-disable no-unused-vars */
import api from "../../../services/axios.service";
import { DeleteModal } from "../../../shared/DeletedModal";
import { Modal } from "../../../shared/Modal";
import { useAlert } from "../../../store/AlertContext";
import { FormAddTarget } from "./FormAddTarget";
import { FormEditTarget } from "./FormEditTarget";

export function TargetModal({ isOpen = false, type, title, onClose, data }) {
  const { showAlert } = useAlert();

  const handleAdd = async (newData) => {
    try {
      await api.post("/master/target", newData);
      showAlert("success", "Created Target Successfully!");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (newData) => {
    try {
      await api.put(`/master/target/${data.id}`, newData);
      showAlert("success", "Target berhasil diperbarui!");
      onClose();
    } catch (error) {
      console.error("❌ Error updating target:", error);
      showAlert("error", "Gagal memperbarui target!");
    }
  };

  const handleDeleted = async () => {
    try {
      await api.delete(`/master/target/${data}`);
      showAlert("success", "Target berhasil dihapus!");
      onClose();
    } catch (error) {
      console.error("❌ Error deleting target:", error);
      showAlert("error", "Gagal menghapus target!");
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      {type === "ADD" && <FormAddTarget onAdd={handleAdd} onClose={onClose} />}
      {type === "EDIT" && (
        <FormEditTarget initialData={data} onSubmit={handleEdit} />
      )}
      {type === "DELETE" && (
        <DeleteModal
          onDelete={handleDeleted}
          onClose={onClose}
          itemName="target"
        />
      )}
    </Modal>
  );
}
