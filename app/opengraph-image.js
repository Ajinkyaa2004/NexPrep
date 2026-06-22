import { ImageResponse } from "next/og";

export const alt = "NexPrep AI — Ace Your Next Interview with AI Mock Interviews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #4A6CFF 0%, #5C73FF 50%, #8393FF 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "34px",
            fontWeight: 700,
            opacity: 0.95,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "white",
              color: "#4A6CFF",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          NexPrep AI
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "48px",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Ace your next interview with AI.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "32px",
            opacity: 0.85,
            maxWidth: "900px",
          }}
        >
          Mock interviews · Instant feedback · ATS resume checker · Resume builder
        </div>
      </div>
    ),
    { ...size }
  );
}
