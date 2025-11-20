interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const language = props["data-language"];

  return (
    <div className="group my-6 overflow-hidden rounded-2xl border border-border/70 bg-page/80 shadow-sm shadow-black/30">
      {/* macOS-style top bar */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-[11px] text-second">
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        {language && (
          <span className="text-[10px] uppercase tracking-wide text-second/80">
            {language}
          </span>
        )}
      </div>

      <pre
        {...props}
        className={`overflow-x-auto px-4 py-4 text-[13px] leading-relaxed ${
          className ?? ""
        }`}
      >
        {children}
      </pre>
    </div>
  );
}
