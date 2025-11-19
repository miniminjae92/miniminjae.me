import { FaCreativeCommons, FaCreativeCommonsBy } from "react-icons/fa";

export default function PostLicense() {
  return (
    <div className="text-[12px] text-second flex justify-end items-center">
      <p className="flex items-center gap-1.5">
        This post is licensed under
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-heading transition-colors"
        >
          CC BY 4.0
          <FaCreativeCommons aria-label="Creative Commons" />
          <FaCreativeCommonsBy aria-label="Attribution" />
        </a>
      </p>
    </div>
  );
}
