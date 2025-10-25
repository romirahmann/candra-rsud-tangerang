/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { useAlert } from "../../store/AlertContext";
import api from "../../services/axios.service";
import { useRouter } from "@tanstack/react-router";

export function LoginPage() {
  const [formLogin, setFormLogin] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const { loading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(loginFailure(null));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormLogin({ ...formLogin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    if (!formLogin.username || !formLogin.password) {
      dispatch(loginFailure("Username & Password is required!"));
      return showAlert("error", "Username & Password is required!");
    }

    try {
      const res = await api.post("/auth/login", formLogin);
      const data = res.data.data;

      const mockUser = data.userData;
      const mockToken = data.token;

      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      showAlert("success", "Login Successfully!");
      router.navigate({ to: mockUser.jabatan === "User" ? "/scanning" : "/" });
    } catch {
      dispatch(loginFailure("Wrong username or password!"));
      showAlert("error", "Wrong username or password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 px-4">
      <div className="relative w-full max-w-md bg-[#1e3a8a] bg-opacity-95 rounded-2xl shadow-2xl p-8 border border-blue-300/30">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <img
            src="/RSUD-KAB-TANGERANG/images/logo_candra.png"
            alt="Logo"
            className="w-14 mx-auto mb-3"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}
          />
          <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-sm">
            CANDRA
          </h1>
          <p className="text-gray-200 text-sm mt-1">RSUD Kabupaten Tangerang</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-100 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formLogin.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formLogin.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg py-2.5 mt-2 flex justify-center items-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-200">
          © {new Date().getFullYear()} IT Developer. All rights reserved.
        </div>

        {/* Decorative Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-blue-400 via-cyan-300 to-purple-500 opacity-10"></div>
      </div>
    </div>
  );
}
