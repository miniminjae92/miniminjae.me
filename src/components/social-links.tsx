import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

interface SocialLinksProps {
  email: string;
  github: string;
  linkedin: string;
}

export function SocialLinks({ email, github, linkedin }: SocialLinksProps) {
  return (
    <div className="flex items-center gap-3 text-second">
      <a href={`mailto:{email}`} className="hover:text-heading">
        <MdOutlineAlternateEmail size={18} />
      </a>
      <a href={github} className="hover:text-heading">
        <FaGithub size={18} />
      </a>
      <a href={linkedin} className="hover:text-heading">
        <FaLinkedin size={18} />
      </a>
    </div>
  );
}
