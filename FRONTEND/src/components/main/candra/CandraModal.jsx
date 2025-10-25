/* eslint-disable no-unused-vars */
import api from "../../../services/axios.service";
import { DeleteModal } from "../../../shared/DeletedModal";
import { Modal } from "../../../shared/Modal";
import { useAlert } from "../../../store/AlertContext";
import { FormEditCandra } from "./FormEditCandra";

export function CandraModal({ isOpen = false, type, title, onClose, data }) {
  const { showAlert } = useAlert();

  // ✅ Handle Edit Data
  const handleEdit = async (newData) => {
    try {
      console.log(newData);
      await api.put(
        `/master/candra/${data.kode_checklist}/${data.idproses}`,
        newData
      );
      showAlert("success", "Data Candra berhasil diperbarui!");
      onClose();
    } catch (error) {
      console.error("❌ Error updating data:", error);
      showAlert("error", "Gagal memperbarui data Candra!");
    }
  };

  // ✅ Handle Delete Data
  const handleDeleted = async () => {
    try {
      console.log(data);
      await api.delete(`/master/candra/${data.id}`);
      showAlert("success", "Data Candra berhasil dihapus!");
      onClose();
    } catch (error) {
      console.error("❌ Error deleting data:", error);
      showAlert("error", "Gagal menghapus data Candra!");
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      {type === "EDIT" && (
        <FormEditCandra initialData={data} onSubmit={handleEdit} />
      )}
      {type === "DELETE" && (
        <DeleteModal onDelete={handleDeleted} onClose={onClose} />
      )}
    </Modal>
  );
}
