import { hoverStyles } from "@/lib/styles";
import Link from "next/link";
import { FaTags } from "react-icons/fa";

export function TagsButton() {
  return (
    <Link href="/tags" className={hoverStyles.full} aria-label="태그 목록 보기">
      <FaTags />
    </Link>
  );
}
