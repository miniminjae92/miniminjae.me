import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

interface SocialLinksProps {
  email: string;
  github: string;
  linkedin: string;
}

export function SocialLinks({ email, github, linkedin }: SocialLinksProps) {
  return (
    <div className="flex items-center text-heading">
      <a href={`mailto:{email}`} className="p-1 rounded hover:bg-selection">
        <MdOutlineAlternateEmail size={16} />
      </a>
      <a href={github} className="p-1 rounded hover:bg-selection">
        <FaGithub size={16} />
      </a>
      <a href={linkedin} className="p-1 rounded hover:bg-selection">
        <FaLinkedin size={16} />
      </a>
    </div>
  );
}
