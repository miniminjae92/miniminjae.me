// src/components/mdx/mdx-content.tsx
import * as runtime from "react/jsx-runtime";
import type { ComponentType, HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { Callout } from "@/components/mdx/callout";
import { PreWithCopy } from "./pre-with-copy";
import { Spacer } from "./spacer";

const components = {
  // 페이지의 h1은 글 제목이 갖는다. 본문의 `#` 는 섹션 제목이므로 h2로 내린다.
  // h1~h3가 원래 같은 클래스를 쓰고 있어서 시각적 변화는 없고 문서 구조만 바로잡힌다.
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-18 mb-5 font-bold text-heading scroll-m-20" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-18 mb-5 font-bold text-heading scroll-m-20" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-18 mb-5 font-bold text-heading scroll-m-20" {...props} />
  ),
  // h2·h3 와 크기가 같으므로 굵기로만 위계를 가른다. 넷 다 700 이면
  // h4 가 h2 와 구별되지 않는다.
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-18 mb-5 font-normal text-heading" {...props} />
  ),
  // 아래 여백이므로 가드는 마지막 요소에 건다. `:not(:first-child)` 였을 때는
  // 첫 문단만 mb 를 잃어 둘째 문단과 붙고, 대신 본문 끝에 빈 여백이 남았다.
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-[1.75] [&:not(:last-child)]:mb-5" {...props} />
  ),

  // 고운바탕에는 400 과 700 뿐이다. 500(font-medium)은 400 으로 떨어져
  // 강조가 통째로 사라진다 — 진짜 자소가 있는 700 을 쓴다.
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-heading" {...props} />
  ),

  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="ml-6 mt-4 mb-4 list-disc [&>li]:mt-1" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="ml-6 mt-4 mb-4 list-decimal [&>li]:mt-1" {...props} />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-[1.75] my-1" {...props} />
  ),

  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      /* 고운바탕에 이탤릭 자소가 없다 — 합성 기울임이 부리와 가로획 각도를
         비튼다. 왼쪽 굵은 선과 들여쓰기가 이미 인용을 구분한다. */
      className="mt-8 mb-8 border-l-4 border-border pl-6"
      {...props}
    />
  ),

  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className="w-full border-collapse border border-border"
        {...props}
      />
    </div>
  ),
  thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-gray-100 dark:bg-gray-100" {...props} />
  ),
  tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ),
  tr: (props: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className="border-b border-border transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
      {...props}
    />
  ),
  th: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border px-4 py-2 text-left font-bold text-heading [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border border-border px-4 py-2 text-body [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),

  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const className =
      // font-medium 은 400 으로 떨어져 렌더에 아무 영향이 없다. 밑줄과
      // 색이 이미 링크를 표시한다.
      "underline underline-offset-4 decoration-border hover:decoration-second transition-colors text-heading";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },

  // code: (props: any) => {
  //   const isInline = !props["data-theme"] && !props["data-language"];
  //   if (isInline) {
  //     return (
  //       <code
  //         className="relative rounded bg-selection px-[0.3rem] py-[0.2rem] font-mono text-[0.85em] font-bold text-heading"
  //         {...props}
  //       />
  //     );
  //   }
  //   return <code {...props} />;
  // },

  hr: (props: HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),

  img: (props: any) => (
    <span className="my-4 block overflow-hidden rounded-lg border border-border bg-page">
      <Image
        src={props.src}
        alt={props.alt || ""}
        width={800}
        height={400}
        className="w-full h-auto object-cover"
        unoptimized={props.src.startsWith("http")}
      />
      {props.alt && (
        <span className="block p-2 text-center text-sm text-second bg-page border-t border-border">
          {props.alt}
        </span>
      )}
    </span>
  ),

  pre: PreWithCopy,

  Callout,

  Spacer,
};

function createMdxComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as ComponentType<{
    components?: Record<string, ComponentType<any>>;
  }>;
}

interface MDXContentProps {
  code: string;
  components?: Record<string, ComponentType<any>>;
}

export function MDXContent({
  code,
  components: userComponents,
}: MDXContentProps) {
  const Component = createMdxComponent(code);
  return (
    <div className="prose-content">
      <Component components={{ ...components, ...userComponents }} />
    </div>
  );
}
