/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const LoadingScreenComponent = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* 🔄 Animated Loader Icon */}
      <motion.div
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* 📝 Loading Text */}
      <motion.p
        className="text-lg font-semibold tracking-wider text-white uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
};

// ✅ Dibungkus React.memo agar tidak re-render tiap state/context berubah
export const LoadingScreen = React.memo(LoadingScreenComponent);
