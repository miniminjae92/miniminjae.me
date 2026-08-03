import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/config/site-metadata";

export const runtime = "edge";

/**
 * 사이트 본문과 같은 폰트를 카드에도 쓴다.
 *
 * 임베드하지 않으면 fontFamily: "sans-serif" 가 edge 런타임의 기본 폰트로
 * 떨어지는데, 거기에는 한글 글리프가 없어서 두부(tofu)가 된다. 로컬 Node 에는
 * 시스템 한글 폰트가 있어서 개발 중에는 드러나지 않는다.
 *
 * satori 는 ttf / otf / woff 를 읽고 woff2 는 못 읽는다. globals.css 가
 * 이미 쓰고 있는 GounBatang woff 를 그대로 재사용한다.
 */
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff";

let fontPromise: Promise<ArrayBuffer | null> | null = null;

function loadFont(): Promise<ArrayBuffer | null> {
  if (!fontPromise) {
    fontPromise = fetch(FONT_URL)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null);

    // 실패를 영구 캐시하지 않는다. 일시적 오류면 다음 요청에서 다시 시도한다.
    void fontPromise.then((data) => {
      if (!data) fontPromise = null;
    });
  }

  return fontPromise;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || SITE_NAME;
  const description = searchParams.get("description");
  const date = searchParams.get("date");

  const fontData = await loadFont();
  // 폰트를 못 받아도 카드는 나가야 한다. 라틴은 기본 폰트로도 읽힌다.
  const fontFamily = fontData ? "GounBatang" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#121212",
          color: "#EDEDED",
          padding: "80px",
          fontFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#A1A1AA",
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {date ? date : SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.2,
            marginBottom: 20,
            wordBreak: "keep-all",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 32,
              color: "#A1A1AA",
              lineHeight: 1.4,
              maxWidth: "80%",
              wordBreak: "keep-all",
            }}
          >
            {description}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "#EDEDED",
          }}
        >
          {SITE_NAME}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? {
            fonts: [
              {
                name: "GounBatang",
                data: fontData,
                weight: 400 as const,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    },
  );
}
