/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Table } from "../../../shared/Table";

// Dummy data
const initialUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "Admin",
    createdAt: "2025-10-23",
  },
  {
    id: 2,
    username: "user1",
    email: "user1@example.com",
    role: "User",
    createdAt: "2025-10-20",
  },
  {
    id: 3,
    username: "user2",
    email: "user2@example.com",
    role: "User",
    createdAt: "2025-10-21",
  },
];

export function UserPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  // Handlers
  const handleAdd = () => {
    const username = prompt("Masukkan username:");
    if (!username) return;
    const email = prompt("Masukkan email:");
    const role = prompt("Masukkan role (Admin/User):", "User");
    const newUser = {
      id: Date.now(),
      username,
      email,
      role,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleEdit = (user) => {
    const username = prompt("Edit username:", user.username);
    if (!username) return;
    const email = prompt("Edit email:", user.email);
    const role = prompt("Edit role (Admin/User):", user.role);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, username, email, role } : u))
    );
  };

  const handleDelete = (user) => {
    if (confirm(`Apakah yakin ingin menghapus user ${user.username}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  };

  const columns = [
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "createdAt", header: "Created At" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen User</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search user..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <FaPlus /> Tambah User
          </button>
        </div>
      </div>

      {/* Table Component */}
      <Table
        columns={columns}
        data={filteredUsers}
        rowsPerPage={5}
        actionRenderer={(user) => (
          <>
            <button
              onClick={() => handleEdit(user)}
              className="text-yellow-600 hover:text-yellow-800 transition"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(user)}
              className="text-red-600 hover:text-red-800 transition"
            >
              <FaTrash />
            </button>
          </>
        )}
      />
    </div>
  );
}
