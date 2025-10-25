/* eslint-disable no-unused-vars */
import React, { useEffect, useCallback, useMemo } from "react";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export const Modal = React.memo(function Modal({
  isOpen,
  title = "MODAL",
  onClose,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target.id === "modal-backdrop") onClose();
    },
    [onClose]
  );

  const variants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 10 },
    }),
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-90 backdrop-blur-xs"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl max-w-xs lg:max-w-lg lg:w-full p-6 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center border-b pb-3">
              <h1 className="lg:text-xl text-md font-semibold text-gray-800">
                {title}
              </h1>
              <button
                onClick={onClose}
                className="ms-auto text-2xl text-gray-500 hover:text-red-600 active:scale-90 transition-transform"
                aria-label="Close Modal"
              >
                <MdClose />
              </button>
            </div>

            {/* Content */}
            <div className="mainModal mt-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
