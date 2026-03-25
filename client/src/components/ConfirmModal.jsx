import React from "react";
import { AlertCircle } from "lucide-react";

const ConfirmModal = ({ title, positiveAction, negativeAction }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header with Icon */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100"></div>

        {/* Actions */}
        <div className="flex gap-3 p-4">
          <button
            onClick={negativeAction}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={positiveAction}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 active:scale-95 shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
