/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { useAuth } from "../store/AuthContext";
import { LoadingScreen } from "../shared/LoadingScreen";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [userLogin, setUserLogin] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  useEffect(() => {
    setUserLogin(user);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <>
      {userLogin ? (
        <div className="flex h-screen ">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            userLogin={userLogin}
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar
              userLogin={userLogin}
              isUserPopupOpen={isUserPopupOpen}
              setIsUserPopupOpen={setIsUserPopupOpen}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-x-hidden">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}
