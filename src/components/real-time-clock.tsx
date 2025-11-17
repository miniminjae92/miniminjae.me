"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function RealTimeClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(format(new Date(), "yyyy. MM. dd. HH:mm:ss"));
    const timer = setInterval(() => {
      setTime(format(new Date(), "yyyy. MM. dd. HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return <span className="opacity-0">Loading...</span>;

  return <span>{time}</span>;
}
