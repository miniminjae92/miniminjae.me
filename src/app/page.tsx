import Link from "next/link";
import { insights, memos, logs } from "#site/content";
import { format } from "date-fns";
import { SocialLinks } from "@/components/social-links";

type Insight = (typeof insights)[number];
type Memo = (typeof memos)[number];
type Log = (typeof logs)[number];
type AnyPost = Insight | Memo | Log;

function sortByDateDesc(a: AnyPost, b: AnyPost) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

interface SectionProps {
  label: string;
  subtitle: string;
  posts: AnyPost[];
}

function FocusSectionPanel({ label, subtitle, posts }: SectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-heading">
        <Link
          href={`/${label.toLowerCase()}`}
          className="font-bold hover:text-heading hover:bg-gray-200 rounded py-1"
        >
          {label}
        </Link>
        <span className="text-sm text-second">, {subtitle}</span>
      </h2>

      <div className="group/list flex flex-col border-l border-b rounded-bl-lg border-border/60 py-2 pl-4 w-3/4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.permalink}
            className="
              group flex items-center justify-between rounded-lg px-3 py-2
              transition-all duration-300
              hover:bg-gray-100 dark:hover:bg-gray-800/50 
              hover:!opacity-100 group-hover/list:opacity-40
            "
          >
            {/* 제목 */}
            <span className="truncate font-medium text-body transition-colors group-hover:text-heading">
              {post.title}
            </span>

            {/* 날짜 및 화살표 영역 */}
            <div className="flex items-center gap-2 pl-4">
              {/* 날짜: date-fns가 없다면 new Date(post.date).toLocaleDateString() 등을 사용 */}
              <span className="text-xs text-second tabular-nums tracking-tight">
                {format(new Date(post.date), "yy.MM.dd")}
              </span>

              {/* 화살표 애니메이션 */}
              <span className="text-heading opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const latestInsights: Insight[] = [...insights]
    .sort(sortByDateDesc)
    .slice(0, 5);

  const latestMemos: Memo[] = [...memos].sort(sortByDateDesc).slice(0, 5);

  const latestLogs: Log[] = [...logs].sort(sortByDateDesc).slice(0, 5);

  return (
    <section className="space-y-10">
      {/* Header */}
      <header className="mt-10 space-y-5">
        <p className="text-lg text-second">
          <span className="font-bold text-heading">호기심</span>으로 본질을
          묻고, 복잡함을{" "}
          <span className="font-bold text-heading">단순하게</span> 정돈하는
          과정을 사랑합니다.
          <br />
          모든 것에 <span className="font-bold text-heading">감사하며</span>,
          제가 얻은 깨달음이{" "}
          <span className="font-bold text-heading">세상에 선한 기여로</span>{" "}
          남기를 소망합니다.
        </p>

        <SocialLinks
          email="miniminjae92@gmail.com"
          github="https://github.com/miniminjae92"
          linkedin="https://www.linkedin.com/in/miniminjae92"
        />
      </header>

      <div className="grid gap-12 mb-10">
        <FocusSectionPanel
          label="Insight"
          subtitle="나만의 추상화"
          posts={latestInsights}
        />

        <FocusSectionPanel
          label="Memo"
          subtitle="바로 꺼내 쓰는 지식"
          posts={latestMemos}
        />

        <FocusSectionPanel
          label="Log"
          subtitle="시간이 만든 나의 개발 일지"
          posts={latestLogs}
        />
      </div>
    </section>
  );
}
