import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — medicines, hospitals, clinics and pharmacies in Bangladesh`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card shared by every page. Static text only: no data is embedded. Colours: docs/PALETTE.md. */
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
          background: "linear-gradient(135deg, #edf7f2 0%, #d3ecdf 100%)",
          color: "#0b4a3c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#006a4e",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 700,
            }}
          >
            +
          </div>
          <div style={{ fontSize: 40, fontWeight: 600 }}>Healthcare directory</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{siteConfig.name}</div>
        <div style={{ marginTop: 28, width: 120, height: 8, borderRadius: 4, background: "#b34700" }} />
        <div style={{ marginTop: 28, fontSize: 36, color: "#00543f" }}>
          Search medicines, doctors, hospitals, clinics and pharmacies across Bangladesh.
        </div>
      </div>
    ),
    size,
  );
}
