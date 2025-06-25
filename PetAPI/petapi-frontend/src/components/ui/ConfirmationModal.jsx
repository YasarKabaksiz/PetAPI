import React from "react";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cyan-300 mb-1 text-center">{title}</h2>
        <p className="text-gray-300 text-sm text-center mb-2">{message}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded bg-gray-600 text-gray-200 hover:bg-gray-700 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
          >
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
} 