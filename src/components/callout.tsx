import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "default" | "warning" | "danger" | "info";
  title?: string;
  children?: React.ReactNode;
}

export function Callout({ type = "default", title, children }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex flex-col rounded-lg border p-4 text-sm shadow-sm",
        type === "default" &&
          "border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50",
        type === "info" &&
          "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-50",
        type === "warning" &&
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-50",
        type === "danger" &&
          "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50",
      )}
    >
      {title && (
        <div className="mb-2 font-semibold flex items-center gap-2">
          {type === "info" && <span>ℹ️</span>}
          {type === "warning" && <span>⚠️</span>}
          {type === "danger" && <span>🚨</span>}
          {title}
        </div>
      )}
      <div className="leading-normal">{children}</div>
    </div>
  );
}
