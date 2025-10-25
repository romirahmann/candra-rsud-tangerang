/* eslint-disable no-unused-vars */
import { useState } from "react";
import api from "../../../services/axios.service";
import { useAlert } from "../../../store/AlertContext";

export function FormAddUser({ onClose }) {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    jabatan: "User",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/master/register", formData);
      showAlert("success", "Add User Successfully!");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6  max-w-md mx-auto">
      {/* Username */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Masukkan username"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Masukkan password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
        />
      </div>

      {/* Role */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          name="jabatan"
          value={formData.jabatan}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-500"
        >
          <option value={"Admin"}>Admin</option>
          <option value={"Leader"}>Leader</option>
          <option value={"User"}>User</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
        >
          Save User
        </button>
      </div>
    </form>
  );
}
