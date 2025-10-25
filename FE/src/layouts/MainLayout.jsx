import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { LoadingScreen } from "../shared/LoadingScreen";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const userLogin = useMemo(() => user, [user]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "login";
  };

  if (!isAuthenticated || !userLogin) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userLogin={userLogin}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userLogin={userLogin}
          isUserPopupOpen={isUserPopupOpen}
          setIsUserPopupOpen={setIsUserPopupOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
