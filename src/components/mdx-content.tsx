import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

const baseComponents: Record<string, ComponentType<any>> = {};

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

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = createMdxComponent(code);
  return <Component components={{ ...baseComponents, ...components }} />;
}
