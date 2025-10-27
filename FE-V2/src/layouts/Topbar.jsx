/* eslint-disable no-unused-vars */
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { memo, useState } from "react";

export const Topbar = memo(({ userLogin, onLogout }) => {
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-[#f8fafc] border-b border-gray-300 shadow-sm sticky top-0 z-50">
      {/* Logo & Title */}
      <div className="flex items-center font-semibold gap-2">
        <img
          src="/RSUD-KAB-TANGERANG/images/logo_candra.png"
          className="w-10 h-10"
          alt="Logo"
        />
        <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          CANDRA
        </span>
      </div>

      {/* User Section */}
      <div className="relative">
        <button
          onClick={() => setIsUserPopupOpen((prev) => !prev)}
          className="flex items-center gap-2 py-1 px-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200"
        >
          <p className="text-sm md:text-md font-semibold uppercase text-gray-700">
            {userLogin?.username}
          </p>
          <FaUser size={22} className="text-gray-700" />
        </button>

        {isUserPopupOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 shadow-lg rounded-md p-4 transition-all duration-200">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase truncate text-gray-800">
                {userLogin?.username}
              </p>
              <p className="text-xs text-gray-500">{userLogin?.jabatan}</p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full mt-4 py-2 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md transition-colors duration-200"
            >
              <TbLogout size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
