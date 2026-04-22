"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { registerToastHandler, unregisterToastHandler } from "@/libs/Bridge";

export type ToastType = "success" | "error" | "warning" | "info";

type ToastState = {
  id: number;
  message: string;
  type: ToastType;
};

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
};

type ConfirmState = ConfirmOptions & {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type UIContextType = {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (
    options: ConfirmOptions,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  closeConfirm: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [confirm, setConfirm] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmVariant: "primary",
    onConfirm: undefined,
    onCancel: undefined,
  });

  const toastIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++toastIdRef.current;

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 2600);
    },
    []
  );

  useEffect(() => {
    registerToastHandler(showToast);

    return () => {
      unregisterToastHandler();
    };
  }, [showToast]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showConfirm = useCallback(
    (
      options: ConfirmOptions,
      onConfirm: () => void,
      onCancel?: () => void
    ) => {
      setConfirm({
        isOpen: true,
        title: options.title || "Are you sure?",
        message: options.message,
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        confirmVariant: options.confirmVariant || "primary",
        onConfirm,
        onCancel,
      });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirm((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: undefined,
      onCancel: undefined,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    const action = confirm.onConfirm;
    closeConfirm();
    action?.();
  }, [confirm.onConfirm, closeConfirm]);

  const handleCancel = useCallback(() => {
    const action = confirm.onCancel;
    closeConfirm();
    action?.();
  }, [confirm.onCancel, closeConfirm]);

  const value = useMemo(
    () => ({
      showToast,
      showConfirm,
      closeConfirm,
    }),
    [showToast, showConfirm, closeConfirm]
  );

  return (
    <UIContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed left-0 right-0 z-[100] flex justify-center"
        style={{ bottom: "30vh" }}
      >
        <div className="flex flex-col items-center gap-3">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        title={confirm.title || "Are you sure?"}
        message={confirm.message}
        confirmText={confirm.confirmText || "Confirm"}
        cancelText={confirm.cancelText || "Cancel"}
        confirmVariant={confirm.confirmVariant || "primary"}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUIContext must be used within UIProvider");
  }

  return context;
}