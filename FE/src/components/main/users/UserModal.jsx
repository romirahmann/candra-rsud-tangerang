/* eslint-disable no-unused-vars */
import api from "../../../services/axios.service";
import { DeleteModal } from "../../../shared/DeletedModal";
import { Modal } from "../../../shared/Modal";
import { useAlert } from "../../../store/AlertContext";
import { FormAddUser } from "./FormAddUser";
import { FormEditUser } from "./FormEditUser";

export function UserModal({ isOpen = "false", type, title, onClose, data }) {
  const { showAlert } = useAlert();

  const handleEdit = async (newData) => {
    try {
      await api.put(`/master/user/${data.id}`, newData);
      showAlert("success", "Deleted User Successffully!");
      onClose();
    } catch (error) {
      console.log(error);
      showAlert("error", "Deleted User Failed!");
    }
  };

  const handleDeleted = async () => {
    try {
      await api.delete(`/master/user/${data}`);
      showAlert("success", "Deleted User Successffully!");
      onClose();
    } catch (error) {
      console.log(error);
      showAlert("error", "Deleted User Failed!");
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={title} onClose={onClose}>
        {type === "ADD" && <FormAddUser onClose={onClose} />}
        {type === "EDIT" && (
          <FormEditUser initialData={data} onSubmit={handleEdit} />
        )}
        {type === "DELETE" && (
          <DeleteModal onDelete={handleDeleted} onClose={onClose} />
        )}
      </Modal>
    </>
  );
}
