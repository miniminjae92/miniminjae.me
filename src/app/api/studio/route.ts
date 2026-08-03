// src/app/api/studio/route.ts
//
// Studio 의 파일 API. 개발 환경에서만 존재한다.
//
// 프로덕션에서 이 라우트는 404 다. 빌드 산출물에 코드가 남더라도 실행
// 경로가 없다. 파일을 쓰는 API 이므로 게이트를 핸들러마다 반복한다 —
// 한 곳에 모아 두면 나중에 추가되는 핸들러가 조용히 빠진다.

import { NextResponse } from "next/server";
import {
  listDocs,
  readDoc,
  saveDoc,
  moveDoc,
  deleteDraft,
  type StudioLens,
} from "@/lib/studio";

const LENSES = new Set<StudioLens>(["understand", "solve", "reflect", "private"]);

function devOnly(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  const id = new URL(request.url).searchParams.get("id");
  try {
    if (!id) return NextResponse.json({ docs: await listDocs() });
    return NextResponse.json({ id, content: await readDoc(id) });
  } catch (err) {
    return fail(err);
  }
}

export async function PUT(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  try {
    const { id, content } = await request.json();
    if (typeof id !== "string" || typeof content !== "string") {
      return fail(new Error("id 와 content 가 필요합니다."));
    }
    await saveDoc(id, content);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  try {
    const { action, id, lens } = await request.json();
    if (typeof id !== "string") return fail(new Error("id 가 필요합니다."));

    if (action === "move") {
      if (!LENSES.has(lens)) return fail(new Error(`모르는 렌즈: ${lens}`));
      return NextResponse.json(await moveDoc(id, lens));
    }
    if (action === "delete") {
      await deleteDraft(id);
      return NextResponse.json({ ok: true });
    }
    return fail(new Error(`모르는 action: ${action}`));
  } catch (err) {
    return fail(err);
  }
}
