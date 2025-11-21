// src/components/home/home-hero.tsx
import { SocialLinks } from "@/components/social-links";

export function HomeHero() {
  return (
    <header className="mt-10 space-y-5">
      <p className="text-lg text-second">
        <span className="font-bold text-body">호기심</span>으로 본질을 묻고,
        복잡함을 <span className="font-bold text-body">단순하게</span> 정돈하는
        과정을 사랑합니다.
        <br />
        모든 것에 <span className="font-bold text-body">감사하며</span>, 제가
        얻은 깨달음이{" "}
        <span className="font-bold text-body">세상에 선한 기여로</span> 남기를
        소망합니다.
      </p>

      <SocialLinks
        email="miniminjae92@gmail.com"
        github="https://github.com/miniminjae92"
        linkedin="https://www.linkedin.com/in/miniminjae92"
      />
    </header>
  );
}
