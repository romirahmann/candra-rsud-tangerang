/* eslint-disable no-unused-vars */
import { useState, memo } from "react";
import { Link, useLocation, useMatch } from "@tanstack/react-router";
import { Tooltip } from "react-tooltip";
import {
  FaBars,
  FaTachometerAlt,
  FaDatabase,
  FaTasks,
  FaCaretDown,
  FaUsers,
} from "react-icons/fa";
import { MdDocumentScanner } from "react-icons/md";

export const Sidebar = memo(
  ({ isSidebarOpen, setIsSidebarOpen, userLogin }) => {
    const [isKelolaOpen, setIsKelolaOpen] = useState(false);

    const toggleKelola = () => setIsKelolaOpen((prev) => !prev);

    return (
      <div
        className={`bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-lg z-50 transition-all duration-500 ${
          isSidebarOpen ? "w-52" : "w-16"
        }`}
      >
        {/* Toggle */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          <ul className="space-y-1">
            <SidebarItem
              to="/scanning"
              icon={MdDocumentScanner}
              label="Scanning"
              isSidebarOpen={isSidebarOpen}
            />

            {userLogin?.jabatan !== "User" && (
              <>
                <SidebarItem
                  to="/"
                  icon={FaTachometerAlt}
                  label="Dashboard"
                  isSidebarOpen={isSidebarOpen}
                />
                <SidebarItem
                  to="/checksheet"
                  icon={FaTasks}
                  label="Checksheet"
                  isSidebarOpen={isSidebarOpen}
                />
                <SidebarItem
                  to="/update-database"
                  icon={FaDatabase}
                  label="Update Data"
                  isSidebarOpen={isSidebarOpen}
                />

                {/* Kelola Data */}
                <li
                  className="flex items-center p-3 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={toggleKelola}
                >
                  <FaTasks size={20} />
                  {isSidebarOpen && (
                    <>
                      <span className="ml-3 flex-1">Kelola Data</span>
                      <FaCaretDown
                        className={`transition-transform ${
                          isKelolaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </li>

                {isSidebarOpen && isKelolaOpen && (
                  <ul className="ml-6 space-y-1">
                    <SidebarSubItem to="/data-mr" label="Data MR" />
                    <SidebarSubItem to="/data-candra" label="Data Candra" />
                    <SidebarSubItem to="/data-dokumen" label="Data Dokumen" />
                    <SidebarSubItem to="/data-kcp" label="Data KCP" />
                    <SidebarSubItem to="/data-karyawan" label="Data Karyawan" />
                    <SidebarSubItem to="/data-proses" label="Data Proses" />
                    <SidebarSubItem to="/data-target" label="Data Target" />
                    {userLogin?.jabatan === "Admin" && (
                      <SidebarSubItem to="/data-users" label="Data Users" />
                    )}
                  </ul>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    );
  }
);

const SidebarItem = memo(({ to, icon: Icon, label, isSidebarOpen }) => {
  const location = useLocation();
  const match = location.pathname === to;
  return (
    <Link to={to}>
      <li
        className={`flex items-center p-3 rounded-md cursor-pointer transition-colors
          ${
            match
              ? "bg-blue-500 font-semibold text-white"
              : "hover:bg-blue-700 text-white"
          }`}
      >
        <Icon size={20} />
        {isSidebarOpen && <span className="ml-3">{label}</span>}
      </li>
    </Link>
  );
});

const SidebarSubItem = memo(({ to, label }) => {
  const location = useLocation();
  const match = location.pathname === to;

  return (
    <Link to={to}>
      <li
        className={`flex items-center p-2 rounded-md cursor-pointer transition-colors
          ${
            match
              ? "bg-blue-500 font-semibold text-white"
              : "hover:bg-blue-700 text-white"
          }`}
      >
        <span className="ml-2">{label}</span>
      </li>
    </Link>
  );
});
