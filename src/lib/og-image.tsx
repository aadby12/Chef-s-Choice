import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export function defaultOgImageResponse(): ImageResponse {
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
          background: "linear-gradient(145deg, #1A1614 0%, #2C2420 42%, #17130f 100%)",
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#C9A227",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          Maison Solange
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: "#FAF7F2",
            lineHeight: 1.08,
            maxWidth: 920,
            letterSpacing: "-0.02em",
          }}
        >
          {BRAND.name}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(250,247,242,0.78)",
            marginTop: 20,
            maxWidth: 780,
            lineHeight: 1.35,
          }}
        >
          {BRAND.tagline}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 16,
            color: "rgba(250,247,242,0.45)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {`${BRAND.city} · ${BRAND.country}`}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE },
  );
}
