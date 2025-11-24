import { ImageResponse } from "next/og";
import { siteMetadata } from "@/config/site-metadata";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title =
        searchParams.get("title") ||
        (siteMetadata.title as any)?.default ||
        siteMetadata.title;
    const description = searchParams.get("description");
    const date = searchParams.get("date");

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
                    fontFamily: "sans-serif",
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
                    {date ? date : "minjae.log"}
                </div>
                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        lineHeight: 1.1,
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
                        fontWeight: 600,
                        color: "#EDEDED",
                    }}
                >
                    minjae.log
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
