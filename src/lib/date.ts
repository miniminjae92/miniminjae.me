// src/lib/date.ts
import { format } from "date-fns";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? new Date(date) : date;
}

export function formatDate(date: string | Date, pattern: string): string {
  return format(toDate(date), pattern);
}

/** 상세 페이지 상단: "MMM d, yyyy" */
export function formatPostDate(date: string | Date): string {
  return formatDate(date, "MMM d, yyyy");
}

/** 홈 카드: "yy.MM.dd" */
export function formatPostDateShort(date: string | Date): string {
  return formatDate(date, "yy.MM.dd");
}

/** 아카이브 리스트: "MM. dd." */
export function formatArchiveDate(date: string | Date): string {
  return formatDate(date, "MM. dd.");
}

/** 푸터 시계용: "yyyy. MM. dd. HH:mm:ss" */
export function formatClock(date: Date = new Date()): string {
  return format(date, "yyyy. MM. dd. HH:mm:ss");
}
