"use client";

import { useUIContext } from "@/context/UiContext";

export function useUI() {
  return useUIContext();
}