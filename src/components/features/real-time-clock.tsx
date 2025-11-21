"use client";

import { useEffect, useState } from "react";
import { formatClock } from "@/lib/date";

export function RealTimeClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatClock());

    const timer = setInterval(() => {
      setTime(formatClock());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return <span className="opacity-0">Loading...</span>;

  return <span>{time}</span>;
}
