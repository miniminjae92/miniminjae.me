import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

interface SocialLinksProps {
  email: string;
  github: string;
  linkedin: string;
}

const badgeStyle = "p-1 rounded hover:bg-selection";
const badgeSize = 16;

export function SocialLinks({ email, github, linkedin }: SocialLinksProps) {
  return (
    <div className="flex items-center text-body hover:text-heading">
      <a href={`mailto:${email}`} className={badgeStyle}>
        <MdOutlineAlternateEmail size={badgeSize} />
      </a>
      <a href={github} className={badgeStyle}>
        <FaGithub size={badgeSize} />
      </a>
      <a href={linkedin} className={badgeStyle}>
        <FaLinkedin size={badgeSize} />
      </a>
    </div>
  );
}
