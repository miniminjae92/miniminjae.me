// src/components/layout/page-shell.tsx
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="page-shell flex min-h-screen flex-col pt-[var(--page-top)]">
      {children}
    </div>
  );
}
