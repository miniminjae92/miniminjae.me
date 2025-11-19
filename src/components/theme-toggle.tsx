"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="rounded-md bg-page border border-border px-2 py-1 text-xs text-second"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
