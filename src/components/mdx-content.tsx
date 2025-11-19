import * as runtime from "react/jsx-runtime";
import type { ComponentType, HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { Callout } from "./callout";

const components = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mt-12 mb-4 text-3xl font-bold text-heading scroll-m-20"
      {...props}
    />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-10 mb-4 text-2xl font-semibold text-heading scroll-m-20 border-b border-border pb-2"
      {...props}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-8 mb-4 text-xl font-semibold text-heading scroll-m-20"
      {...props}
    />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-8 mb-4 text-lg font-semibold text-heading" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 text-body [&:not(:first-child)]:mt-5" {...props} />
  ),

  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="ml-6 list-disc [&>li]:mt-1 text-body" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="ml-6 list-decimal [&>li]:mt-1 text-body" {...props} />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7 my-1" {...props} />
  ),

  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-4 border-border pl-6 italic text-second"
      {...props}
    />
  ),

  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className="w-full border-collapse border border-border text-sm"
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

  pre: (props: any) => {
    const language = props["data-language"] as string | undefined;

    return (
      <div className="group my-6 overflow-hidden rounded-2xl border border-border/70 bg-page/80 shadow-sm shadow-black/30">
        {/* macOS-style top bar */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-[11px] text-second">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          {language && (
            <span className="text-[10px] uppercase tracking-wide text-second/80">
              {language}
            </span>
          )}
        </div>

        <pre
          {...props}
          className={`overflow-x-auto px-4 py-4 text-[13px] leading-relaxed ${
            props.className ?? ""
          }`}
        />
      </div>
    );
  },
  // --- [기타 요소] ---
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const className =
      "font-medium underline underline-offset-4 decoration-border hover:decoration-second transition-colors text-heading";
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
  code: (props: any) => {
    const isInline = !props["data-theme"] && !props["data-language"];

    if (isInline) {
      return (
        <code
          className="relative rounded bg-selection px-[0.3rem] py-[0.2rem] font-mono text-[0.85em] font-semibold text-heading"
          {...props}
        />
      );
    }

    return <code {...props} />;
  },
  hr: (props: HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),
  img: (props: any) => (
    <figure className="block my-8 overflow-hidden rounded-lg border border-border bg-page">
      <Image
        src={props.src}
        alt={props.alt || ""}
        width={800}
        height={400}
        className="w-full h-auto object-cover"
        unoptimized={props.src.startsWith("http")}
      />
      {props.alt && (
        <figcaption className="block p-2 text-center text-xs text-second bg-page border-t border-border">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),

  // --- [커스텀 컴포넌트 등록] ---
  Callout,
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
  return <Component components={{ ...components, ...userComponents }} />;
}
