// src/components/author-profile.tsx
import { ArchiveNav } from "../layout/archive-nav";
import { SocialLinks } from "../ui/social-links";

export default function AuthorProfile() {
  return (
    <div className="border border-border rounded px-4 py-6 space-y-2">
      <ArchiveNav />
      <SocialLinks
        email="miniminjae92@gmail.com"
        github="https://github.com/miniminjae92"
        linkedin="https://www.linkedin.com/in/miniminjae92"
      />
    </div>
  );
}
