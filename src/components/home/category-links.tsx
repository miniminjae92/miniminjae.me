// src/components/home/category-links.tsx
import Link from "next/link";
import { AnyPost } from "@/lib/posts";
import { formatPostDateShort } from "@/lib/date";

interface HomeCategoryLinksProps {
  insights: AnyPost[];
  memos: AnyPost[];
  logs: AnyPost[];
}

type CategoryKey = keyof HomeCategoryLinksProps;

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  subtitle: string;
  href: string;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: "insights",
    label: "Insight",
    subtitle: "나만의 추상화",
    href: "/insight",
  },
  {
    key: "memos",
    label: "Memo",
    subtitle: "바로 꺼내 쓰는 지식",
    href: "/memo",
  },
  {
    key: "logs",
    label: "Log",
    subtitle: "시간이 만든 나의 개발 일지",
    href: "/log",
  },
];

const styles = {
  item: "group flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:!opacity-100 group-hover/list:opacity-40",
  arrow:
    "text-heading opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
  date: "text-xs text-second tabular-nums tracking-tight",
};

export function HomeCategoryLinks(props: HomeCategoryLinksProps) {
  return (
    <div className="max-w-content gap-12 grid mb-10">
      {CATEGORY_CONFIGS.map((config) => (
        <FocusSectionPanel
          key={config.key}
          label={config.label}
          subtitle={config.subtitle}
          href={config.href}
          posts={props[config.key]}
        />
      ))}
    </div>
  );
}

interface FocusSectionPanelProps {
  label: string;
  subtitle: string;
  href: string;
  posts: AnyPost[];
}

function FocusSectionPanel({
  label,
  subtitle,
  href,
  posts,
}: FocusSectionPanelProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-heading">
        <Link href={href} className="hover:bg-selection rounded py-1">
          {label}
        </Link>
        <span className="text-second">, {subtitle}</span>
      </h2>

      <div className="group/list flex flex-col border-l border-b rounded-bl-lg border-border/60 py-2 pl-4">
        {posts.map((post) => (
          <Link key={post.slug} href={post.permalink} className={styles.item}>
            <span className="truncate font-medium text-body transition-colors group-hover:text-heading">
              {post.title}
            </span>

            <div className="flex items-center gap-2 pl-4">
              <span className={styles.date}>
                {formatPostDateShort(post.date)}
              </span>
              <span className={styles.arrow}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
