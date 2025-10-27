/* eslint-disable no-unused-vars */
import api from "../../../services/axios.service";
import { DeleteModal } from "../../../shared/DeletedModal";
import { Modal } from "../../../shared/Modal";
import { useAlert } from "../../../store/AlertContext";
import { FormAddProses } from "./FormAddProses";
import { FormEditProses } from "./FormEditProses";

export function ProsesModal({ isOpen = false, type, title, onClose, data }) {
  const { showAlert } = useAlert();

  const handleAdd = async (newData) => {
    try {
      await api.post("/master/proses", newData);
      showAlert("success", "Created Proses Successfully!");
      onClose();
    } catch (error) {
      console.log(error);
      showAlert("error", "Gagal membuat proses!");
    }
  };

  const handleEdit = async (newData) => {
    try {
      await api.put(`/master/proses/${data.id}`, newData);
      showAlert("success", "Proses berhasil diperbarui!");
      onClose();
    } catch (error) {
      console.error("❌ Error updating proses:", error);
      showAlert("error", "Gagal memperbarui proses!");
    }
  };

  const handleDeleted = async () => {
    try {
      await api.delete(`/master/proses/${data}`);
      showAlert("success", "Proses berhasil dihapus!");
      onClose();
    } catch (error) {
      console.error("❌ Error deleting proses:", error);
      showAlert("error", "Gagal menghapus proses!");
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      {type === "ADD" && <FormAddProses onAdd={handleAdd} onClose={onClose} />}
      {type === "EDIT" && (
        <FormEditProses initialData={data} onSubmit={handleEdit} />
      )}
      {type === "DELETE" && (
        <DeleteModal
          onDelete={handleDeleted}
          onClose={onClose}
          itemName="proses"
        />
      )}
    </Modal>
  );
}
