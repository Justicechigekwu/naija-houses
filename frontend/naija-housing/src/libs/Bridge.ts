import type { ToastType } from "@/context/UiContext";

type ToastHandler = (message: string, type?: ToastType) => void;

let toastHandler: ToastHandler | null = null;

export function registerToastHandler(handler: ToastHandler) {
  toastHandler = handler;
}

export function unregisterToastHandler() {
  toastHandler = null;
}

export function showGlobalToast(
  message: string,
  type: ToastType = "info"
) {
  if (toastHandler) {
    toastHandler(message, type);
  }
}