"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Syncs Zustand darkMode state with the HTML root class.
 * This runs only on the client side.
 */
export default function ThemeManager() {
  const dark = useAppStore((s) => s.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  // This component does not render any UI.
  return null;
}
