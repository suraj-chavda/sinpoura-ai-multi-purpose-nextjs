import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/constants";

export const alt = `${APP_NAME} — multi-purpose AI chat template`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage: "linear-gradient(145deg, #18181b 0%, #27272a 45%, #3f3f46 100%)",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: "48px 64px",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              backgroundColor: "#09090b",
              border: "1px solid rgba(250,250,250,0.06)",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 10,
              boxSizing: "border-box",
              padding: "17px 14px",
            }}
          >
            <div
              style={{
                width: 17,
                height: 44,
                borderRadius: 8.5,
                backgroundColor: "#fafafa",
              }}
            />
            <div
              style={{
                width: 17,
                height: 36,
                borderRadius: 8.5,
                backgroundColor: "#fafafa",
                opacity: 0.92,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 }}>
            <div
              style={{
                fontSize: 62,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "#fafafa",
                lineHeight: 1.05,
              }}
            >
              {APP_NAME}
            </div>
            <div style={{ fontSize: 28, color: "rgba(250,250,250,0.78)", lineHeight: 1.35 }}>
              Multi-purpose AI chat · Next.js · MongoDB · Zustand · xoin-js
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
