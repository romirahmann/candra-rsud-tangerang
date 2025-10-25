/* eslint-disable no-unused-vars */
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import NotFound from "../pages/main/NotFound";
import { MainLayout } from "../layouts/MainLayout";
import { Dashboard } from "../pages/main/Dashboard";
import { store } from "../store";

// 🔹 Root route (global error & not found handler)
const rootRoute = createRootRoute({
  notFoundComponent: NotFound,
});

// 🔹 Protected layout — hanya boleh diakses jika login
const mainLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "main-layout",
  component: MainLayout,
  beforeLoad: ({ context }) => {
    const { store } = context;
    const state = store.getState();

    // Cek auth
    if (!state.auth.isAuthenticated) {
      console.warn("UNAUTHORIZED! Redirecting to login...");
      throw redirect({
        to: "/login",
      });
    }
  },
});

// 🔹 Dashboard (anak dari MainLayout)
const dashboardRoute = createRoute({
  getParentRoute: () => mainLayout,
  path: "/",
  component: Dashboard,
});

// 🔹 Tambahkan route login publik
import { LoginPage } from "../pages/auth/LoginPage";
import { UserPage } from "../pages/main/kelolaData/UserPage";
import { TargetPage } from "../pages/main/kelolaData/TargetPage";
import { ProsesPage } from "../pages/main/kelolaData/ProsesPage";
import { CandraPage } from "../pages/main/kelolaData/CandraPage";
import { ScanPage } from "../pages/main/ScanPage";
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// KELOLA DATA
const userRoute = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-users",
  component: UserPage,
});
const targetRoute = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-target",
  component: TargetPage,
});
const prosesRoute = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-proses",
  component: ProsesPage,
});
const candraRoute = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-candra",
  component: CandraPage,
});
const scanRoute = createRoute({
  getParentRoute: () => mainLayout,
  path: "/scanning",
  component: ScanPage,
});
// 🔹 Gabungkan semuanya
const routeTree = rootRoute.addChildren([
  loginRoute,
  mainLayout.addChildren([
    dashboardRoute,
    userRoute,
    targetRoute,
    prosesRoute,
    candraRoute,
    scanRoute,
  ]),
]);

// 🔹 Buat router
export const router = createRouter({
  routeTree,
  basepath: "/RSUD-KAB-TANGERANG",
  context: { store },
});
