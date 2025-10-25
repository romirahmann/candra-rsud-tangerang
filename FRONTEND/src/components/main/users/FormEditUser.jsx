/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

export function FormEditUser({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    id: "",
    username: "",
    email: "",
    jabatan: "",
    password: "",
    trn_date: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        username: initialData.username || "",
        email: initialData.email || "",
        jabatan: initialData.jabatan || "User",
        password: initialData.password,
        trn_date: initialData.trn_date,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4max-w-lg mx-auto"
    >
      {/* Username */}
      <div className="col-span-2">
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="Enter username"
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
      </div>

      {/* Role Select */}
      <div className="col-span-2">
        <label
          htmlFor="jabatan"
          className="block text-sm font-semibold text-gray-700"
        >
          Role
        </label>
        <select
          id="jabatan"
          name="jabatan"
          value={form.jabatan}
          onChange={handleChange}
          required
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          <option value={"Admin"}>Admin</option>
          <option value={"Leader"}>Leader</option>
          <option value={"User"}>User</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="col-span-2 text-right">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          {initialData?.id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
