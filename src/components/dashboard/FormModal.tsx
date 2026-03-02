"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitText: string;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  cancelText?: string;
  width?: string; // e.g. "max-w-lg", "max-w-2xl"
}

export function FormModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  submitText,
  submitLoading = false,
  submitDisabled = false,
  cancelText = "Cancel",
  width = "max-w-lg",
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {children}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-5 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              disabled={submitLoading || submitDisabled}
              className="px-6 py-2.5  bg-[#C46A0A] text-white rounded-lg hover:from-amber-600 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium shadow-sm flex items-center gap-2 transition-all"
            >
              {submitLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
