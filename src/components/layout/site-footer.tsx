import { RealTimeClock } from "../real-time-clock";

export function SiteFooter() {
  return (
    <footer className="mt-10 backdrop-blur">
      <div className="flex items-center justify-between py-10 text-xs text-second">
        <span>Copyright © 강민재</span>
        <span className="text-[11px] font-mono tabular-nums">
          <RealTimeClock />
        </span>
      </div>
    </footer>
  );
}
