import { RealTimeClock } from "../real-time-clock";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 text-xs text-neutral-500">
        <span>Copyright © 강민재﹒Minjae Kang</span>
        <span className="text-[11px] font-mono tabular-nums">
          <RealTimeClock />
        </span>
      </div>
    </footer>
  );
}
