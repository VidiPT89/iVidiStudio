import { ImageResponse } from "next/og";

// The preview card shown when the showcase link is shared (LinkedIn, WhatsApp, email…).
export const alt = "iVidi Studio HQ — the whole studio in one building, live";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FLOORS = 12;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 90px",
          gap: 80,
          background: "radial-gradient(circle at 25% 40%, rgba(254,110,0,0.28), #0a0a0f 60%)",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
        }}
      >
        {/* the tower */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: "#fe6e00", marginBottom: 6 }} />
          <div style={{ width: 3, height: 26, background: "#fcbb00" }} />
          {Array.from({ length: FLOORS }, (_, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginTop: 6 }}>
              {[0, 1, 2, 3].map((w) => (
                <div
                  key={w}
                  style={{
                    width: 30,
                    height: 22,
                    borderRadius: 4,
                    background: w === 2 && i === 4 ? "#fe6e00" : (i + w) % 3 === 0 ? "#3a2a18" : "#dd7400",
                    marginLeft: w === 2 ? 26 : 0,
                  }}
                />
              ))}
            </div>
          ))}
          <div style={{ width: 240, height: 5, borderRadius: 5, marginTop: 14, background: "linear-gradient(90deg,#fe6e00,#fcbb00)" }} />
        </div>

        {/* the words */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#fe6e00",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 14, background: "#fe6e00" }} />
            Live
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, marginTop: 18, letterSpacing: -2 }}>
            iVidi Studio <span style={{ color: "#fcbb00", marginLeft: 22 }}>HQ</span>
          </div>
          <div style={{ fontSize: 34, color: "#aab3c5", marginTop: 16, maxWidth: 620, lineHeight: 1.3 }}>
            The whole studio in one building. Every floor a team, every request riding the elevator.
          </div>
          <div style={{ fontSize: 24, color: "#8a92a6", marginTop: 40 }}>Developed by David Arsénio Martins · ividi.dev</div>
        </div>
      </div>
    ),
    size,
  );
}
