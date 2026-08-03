"use client";

// src/components/studio/studio-client.tsx
//
// 나만보기 초안과 공개 글을 한 화면에서 읽고 고치고 옮긴다.
//
// 루트 레이아웃이 모든 라우트를 PageShell(50rem)로 감싸기 때문에 여기서
// fixed inset-0 으로 빠져나온다. 라우트 그룹을 새로 파서 레이아웃을
// 둘로 쪼개는 것보다 침습이 훨씬 적고, 개발 전용 도구라 그래도 된다.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { vim, Vim } from "@replit/codemirror-vim";
import { cn } from "@/lib/utils";

interface StudioDoc {
  id: string;
  slug: string;
  title: string;
  date: string;
  lens: "understand" | "solve" | "reflect" | "private";
  isPrivate: boolean;
  source?: string;
  sourceUrl?: string;
  tags: string[];
  chars: number;
}

const LENS_LABEL: Record<StudioDoc["lens"], string> = {
  private: "나만보기",
  understand: "Understand",
  solve: "Solve",
  reflect: "Reflect",
};

const FILTERS = [
  { key: "all", label: "전체" },
  { key: "private", label: "나만보기" },
  { key: "understand", label: "Understand" },
  { key: "solve", label: "Solve" },
  { key: "reflect", label: "Reflect" },
] as const;

/** CodeMirror 를 사이트 토큰에 맞춘다. 별도 팔레트를 들이지 않는다. */
const editorTheme = EditorView.theme({
  "&": { height: "100%", fontSize: "14px", backgroundColor: "transparent" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    lineHeight: "1.7",
    overflow: "auto",
  },
  ".cm-content": { padding: "1.25rem 0", caretColor: "var(--heading)" },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--text-disabled)",
  },
  ".cm-activeLine": { backgroundColor: "var(--selection)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
  "&.cm-focused": { outline: "none" },
  ".cm-fat-cursor": { background: "var(--text-second)" },
  ".cm-panels": {
    backgroundColor: "var(--page-background)",
    color: "var(--text-body)",
    borderTop: "1px solid var(--border)",
  },
});

export function StudioClient() {
  const [docs, setDocs] = useState<StudioDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [docVersion, setDocVersion] = useState(0);
  const [status, setStatus] = useState("");
  const [vimOn, setVimOn] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [preview, setPreview] = useState("");

  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const vimCompartment = useRef(new Compartment());
  // 저장 핸들러는 vim 의 :w 에서도 불린다. ex 명령은 한 번만 등록되므로
  // 최신 클로저를 ref 로 넘긴다.
  const saveRef = useRef<() => void>(() => {});
  // 글을 여는 dispatch 도 docChanged 를 발생시킨다. 그대로 두면 열자마자
  // "저장 안 됨"이 뜬다. 프로그램이 넣은 변경인지 구분한다.
  const loadingRef = useRef(false);

  const active = useMemo(
    () => docs.find((d) => d.id === activeId) ?? null,
    [docs, activeId],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((d) => {
      if (filter !== "all" && d.lens !== filter) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        (d.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [docs, filter, query]);

  const counts = useMemo(() => {
    const c = { total: docs.length, private: 0, published: 0 };
    for (const d of docs) {
      if (d.isPrivate) c.private++;
      else c.published++;
    }
    return c;
  }, [docs]);

  // ───────────────────────────────────────────────── data

  const loadList = useCallback(async () => {
    const res = await fetch("/api/studio");
    const json = await res.json();
    if (json.error) return setStatus(`목록 실패: ${json.error}`);
    setDocs(json.docs);
    return json.docs as StudioDoc[];
  }, []);

  // 최초 목록. 응답이 늦게 와도 언마운트 뒤에는 상태를 건드리지 않는다.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/studio");
      const json = await res.json();
      if (cancelled) return;
      if (json.error) setStatus(`목록 실패: ${json.error}`);
      else setDocs(json.docs);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openDoc = useCallback(async (id: string) => {
    const res = await fetch(`/api/studio?id=${encodeURIComponent(id)}`);
    const json = await res.json();
    if (json.error) return setStatus(`열기 실패: ${json.error}`);
    setActiveId(id);
    setStatus("");
    const view = viewRef.current;
    if (view) {
      loadingRef.current = true;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: json.content },
      });
      loadingRef.current = false;
    }
    setDirty(false);
  }, []);

  const save = useCallback(async () => {
    const view = viewRef.current;
    if (!view || !activeId) return;
    const content = view.state.doc.toString();
    setStatus("저장 중…");
    const res = await fetch("/api/studio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeId, content }),
    });
    const json = await res.json();
    if (json.error) return setStatus(`저장 실패: ${json.error}`);
    setDirty(false);
    setStatus("저장됨");
    void loadList();
  }, [activeId, loadList]);

  // 렌더 중에 ref 를 쓰면 안 된다. vim 의 :w 는 한 번만 등록되므로 최신
  // save 클로저를 이펙트에서 갈아 끼운다.
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  const move = useCallback(
    async (lens: StudioDoc["lens"]) => {
      if (!activeId || !active) return;
      if (lens !== "private" && active.isPrivate) {
        const ok = window.confirm(
          `〈${active.title}〉를 ${LENS_LABEL[lens]}로 발행합니다.\n\n` +
            `공개 저장소로 커밋될 수 있는 위치로 옮겨집니다. 계속할까요?`,
        );
        if (!ok) return;
      }
      setStatus("옮기는 중…");
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move", id: activeId, lens }),
      });
      const json = await res.json();
      if (json.error) return setStatus(`이동 실패: ${json.error}`);
      await loadList();
      setStatus(`${LENS_LABEL[lens]}로 옮겼습니다`);
      void openDoc(json.id);
    },
    [activeId, active, loadList, openDoc],
  );

  const removeDraft = useCallback(async () => {
    if (!activeId || !active) return;
    if (!window.confirm(`〈${active.title}〉 초안을 삭제합니다. 되돌릴 수 없습니다.`))
      return;
    const res = await fetch("/api/studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: activeId }),
    });
    const json = await res.json();
    if (json.error) return setStatus(`삭제 실패: ${json.error}`);
    setActiveId(null);
    if (viewRef.current) {
      loadingRef.current = true;
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: "" },
      });
      loadingRef.current = false;
    }
    setDirty(false);
    await loadList();
    setStatus("삭제됨");
  }, [activeId, active, loadList]);

  // ─────────────────────────────────────────────── editor

  useEffect(() => {
    if (!hostRef.current || viewRef.current) return;

    // vim() 은 반드시 keymap 앞에 온다. 뒤에 두면 기본 키맵이 이겨서
    // 노멀 모드 키가 그대로 글자로 입력된다.
    const view = new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [
          vimCompartment.current.of(vim()),
          basicSetup,
          markdown({ codeLanguages: languages }),
          editorTheme,
          EditorView.lineWrapping,
          EditorView.updateListener.of((u) => {
            if (!u.docChanged) return;
            // docVersion 은 미리보기를 다시 그리게 하는 유일한 신호다.
            // dirty 로는 안 된다 — 두 번째 타이핑부터는 값이 true 로
            // 고정돼 이펙트가 다시 돌지 않는다.
            setDocVersion((v) => v + 1);
            if (!loadingRef.current) setDirty(true);
          }),
        ],
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;

    Vim.defineEx("write", "w", () => saveRef.current());
    Vim.defineEx("wq", "wq", () => saveRef.current());

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: vimCompartment.current.reconfigure(vimOn ? vim() : []),
    });
  }, [vimOn]);

  // Ctrl/Cmd+S 는 vim 을 꺼도 동작해야 한다.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ────────────────────────────────────────────── preview

  useEffect(() => {
    if (!showPreview || !activeId) return;
    const view = viewRef.current;
    if (!view) return;

    const timer = setTimeout(async () => {
      const res = await fetch("/api/studio/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: view.state.doc.toString() }),
      });
      const json = await res.json();
      if (!json.error) setPreview(json.html);
    }, 400);
    return () => clearTimeout(timer);
  }, [showPreview, activeId, docVersion]);

  // ─────────────────────────────────────────────── render

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-page text-body">
      <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-2">
        <span className="text-sm font-semibold text-heading">Studio</span>
        <span className="text-2xs text-disabled">
          나만보기 {counts.private} · 공개 {counts.published}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {status ? <span className="text-2xs text-second">{status}</span> : null}
          {dirty ? <span className="text-2xs text-disabled">● 저장 안 됨</span> : null}

          <button
            onClick={() => setVimOn((v) => !v)}
            className={cn(
              "rounded px-2 py-1 text-2xs transition-colors",
              vimOn
                ? "bg-selection font-semibold text-heading"
                : "text-second hover:text-heading",
            )}
            title="vi 키바인딩 (:w 로 저장)"
          >
            vim {vimOn ? "on" : "off"}
          </button>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="rounded px-2 py-1 text-2xs text-second transition-colors hover:text-heading"
          >
            미리보기 {showPreview ? "끄기" : "켜기"}
          </button>
          <button
            onClick={() => void save()}
            disabled={!activeId}
            className="rounded border border-border px-2 py-1 text-2xs text-heading disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* 목록 */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-border">
          <div className="shrink-0 space-y-2 border-b border-border p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목·slug·출처 검색"
              className="w-full rounded border border-border bg-transparent px-2 py-1 text-xs outline-none placeholder:text-disabled focus:border-second"
            />
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded px-1.5 py-0.5 text-2xs transition-colors",
                    filter === f.key
                      ? "bg-selection font-semibold text-heading"
                      : "text-second hover:text-heading",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {visible.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => void openDoc(d.id)}
                  className={cn(
                    "block w-full border-b border-border/50 px-3 py-2 text-left transition-colors hover:bg-selection",
                    d.id === activeId && "bg-selection",
                  )}
                >
                  <span className="block truncate text-xs text-heading">
                    {d.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-2xs text-disabled">
                    <span>{d.date}</span>
                    <span>·</span>
                    <span className={cn(!d.isPrivate && "text-second")}>
                      {LENS_LABEL[d.lens]}
                    </span>
                    {d.source ? (
                      <>
                        <span>·</span>
                        <span>{d.source}</span>
                      </>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
            {visible.length === 0 ? (
              <li className="px-3 py-6 text-center text-2xs text-disabled">
                해당하는 글이 없습니다
              </li>
            ) : null}
          </ul>
        </aside>

        {/* 편집기 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-2">
              <span className="truncate text-xs text-heading">{active.title}</span>
              <code className="text-2xs text-disabled">{active.id}</code>
              {active.sourceUrl ? (
                <a
                  href={active.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xs text-second underline-offset-2 hover:underline"
                >
                  원본 ↗
                </a>
              ) : null}

              <div className="ml-auto flex items-center gap-1">
                <span className="text-2xs text-disabled">옮기기</span>
                {(["private", "understand", "solve", "reflect"] as const).map(
                  (lens) => (
                    <button
                      key={lens}
                      onClick={() => void move(lens)}
                      disabled={active.lens === lens}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-2xs transition-colors",
                        active.lens === lens
                          ? "bg-selection font-semibold text-heading"
                          : "text-second hover:text-heading",
                      )}
                    >
                      {LENS_LABEL[lens]}
                    </button>
                  ),
                )}
                {active.isPrivate ? (
                  <button
                    onClick={() => void removeDraft()}
                    className="ml-2 rounded px-1.5 py-0.5 text-2xs text-disabled hover:text-heading"
                  >
                    삭제
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1">
            <div
              ref={hostRef}
              className="min-w-0 flex-1 overflow-hidden px-4"
              // vim 노멀 모드 키가 브라우저 단축키로 새지 않게 한다.
              onKeyDown={(e) => e.stopPropagation()}
            />
            {showPreview ? (
              <div className="min-w-0 flex-1 overflow-y-auto border-l border-border px-6 py-5">
                {activeId ? (
                  <article
                    className="prose-content studio-preview"
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                ) : (
                  <p className="text-2xs text-disabled">
                    왼쪽에서 글을 고르세요.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-border px-4 py-1.5 text-2xs text-disabled">
        vim 노멀 모드에서 <code>:w</code> 저장 · <code>Cmd/Ctrl+S</code> 도 동작 ·
        나만보기는 <code>src/content/.drafts/</code> 에 있고 gitignore 되어 커밋되지
        않습니다
      </footer>
    </div>
  );
}
