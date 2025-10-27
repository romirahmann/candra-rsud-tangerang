/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Table } from "../../../shared/Table";
import api from "../../../services/axios.service";
import { UserModal } from "../../../components/main/users/UserModal";

import { listenToUpdate } from "../../../services/socket.service";
import { TargetModal } from "../../../components/main/target/TargetModal";

export function TargetPage() {
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    data: null,
  });

  const [targets, setTarget] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    listenToUpdate("target_created", fetchUser);
    listenToUpdate("target_updated", fetchUser);
    listenToUpdate("target_deleted", fetchUser);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/master/targets`);
      setTarget(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return targets;
    return targets.filter(
      (t) =>
        t.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.nilai?.includes(searchQuery)
    );
  }, [searchQuery, targets]);

  const columns = [
    { header: "Nama Target", key: "nama" },
    { header: "Nilai", key: "nilai" },
  ];

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between  md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MANAJEMEN TARGET</h1>
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
            onClick={() =>
              setModal({ isOpen: true, type: "ADD", title: "Add User" })
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-1 md:py-2 px-2 md:px-4 rounded-lg transition-colors text-sm md:text-[1em] lg:text-[1.1em]"
          >
            <FaPlus /> Tambah Target
          </button>
        </div>
      </div>

      {/* Table Component */}
      <Table
        columns={columns}
        data={filteredUsers}
        rowsPerPage={5}
        actionRenderer={(target) => (
          <>
            <button
              onClick={() =>
                setModal({
                  isOpen: true,
                  type: "EDIT",
                  title: "Edit Target",
                  data: target,
                })
              }
              className="text-yellow-600 hover:text-yellow-800 transition"
            >
              <FaEdit />
            </button>
            <button
              onClick={() =>
                setModal({
                  isOpen: true,
                  type: "DELETE",
                  title: "Delete Target",
                  data: target.id,
                })
              }
              className="text-red-600 hover:text-red-800 transition"
            >
              <FaTrash />
            </button>
          </>
        )}
      />

      <TargetModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        data={modal.data}
        onClose={() => setModal({ isOpen: false, type: "", title: "" })}
      />
    </div>
  );
}
