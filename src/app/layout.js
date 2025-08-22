import { Exo_2 } from "next/font/google";
import { headers as nextHeaders } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConfigProvider from "@/context/ConfigProvider";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
});

async function getConfig() {
  try {
  // Build absolute URL from incoming request headers
  const h = await nextHeaders();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host") || "localhost:3000";
    const baseUrl = `${proto}://${host}`;
    // Forward middleware-set headers (site host and query hints) so the config API can be multi-site aware
    const forwardHeaders = {};
    const siteHost = h.get("x-site-host") || h.get("host");
    const siteHostName = h.get("x-site-hostname");
    if (siteHost) forwardHeaders["x-site-host"] = siteHost;
    if (siteHostName) forwardHeaders["x-site-hostname"] = siteHostName;
    // forward any x-q-... query hint headers
    for (const key of h.keys()) {
      if (key && key.startsWith && key.startsWith("x-q-")) {
        const val = h.get(key);
        if (val) forwardHeaders[key] = val;
      }
    }

    const res = await fetch(`${baseUrl}/api/config`, {
      cache: "no-store",
      headers: forwardHeaders,
    });

    if (!res.ok) throw new Error("API returned non-200");

    return await res.json();
  } catch (error) {
    console.warn("Falling back to local JSON config:", error);
    const configModule = await import("@/config/site-config.json");
    return configModule.default;
  }
}

// Minimal helpers to get branding from Strapi
async function fetchJson(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => "")}`);
  return res.json();
}

// Prefix relative URLs (if your logoImage is a relative path)
function absUrl(base, raw) {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${base}/${String(raw).replace(/^\/+/, "")}`;
}

async function getSiteBranding() {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const slug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";
  if (!base || !slug) return null;

  // Keep this query simple: fetch by slug, no heavy populate
  const url = `${base}/api/sites?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[limit]=1`;
  const json = await fetchJson(url, token);
  const row = json?.data?.[0];
  const a = row?.attributes || row;
  if (!a) return null;

  // Map only what Header/layout needs
  return {
    title: a.siteTitle || a.name || a.slug || "Site",
    primaryColor: a.primaryColor || "#111111",
    textColor: a.textColor || "#222222",
    menuBackground: a.menuBackground || "#ffffff",
    logoUrl: absUrl(base, a.logoImage || a.logo || a.logoUrl), // your model has logoImage as Text
  };
}

export async function generateMetadata() {
  try {
  const h = await nextHeaders();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host") || "localhost:3000";
  const baseUrl = `${proto}://${host}`;
  const forwardHeaders = {};
  const siteHost = h.get("x-site-host") || h.get("host");
  const siteHostName = h.get("x-site-hostname");
  if (siteHost) forwardHeaders["x-site-host"] = siteHost;
  if (siteHostName) forwardHeaders["x-site-hostname"] = siteHostName;
  for (const key of h.keys()) {
    if (key && key.startsWith && key.startsWith("x-q-")) {
      const val = h.get(key);
      if (val) forwardHeaders[key] = val;
    }
  }

  const res = await fetch(`${baseUrl}/api/config`, {
      cache: "no-store",
      headers: forwardHeaders,
    });
    if (!res.ok) throw new Error("API failed");
    const config = await res.json();
    return {
      title: config.siteTitle,
      description: `Welcome to ${config.siteTitle}`,
    };
  } catch (error) {
    const configModule = await import("@/config/site-config.json");
    const config = configModule.default;

    return {
      title: config.siteTitle,
      description: `Welcome to ${config.siteTitle}`,
    };
  }
}

export default async function RootLayout({ children }) {
  const config = await getConfig();
  const brand = await getSiteBranding();

  // Expose colors as CSS variables so any component can use them
  const cssVars = brand
    ? {
        "--brand-primary": brand.primaryColor,
        "--brand-text": brand.textColor,
        "--brand-menu-bg": brand.menuBackground,
      }
    : {};

  return (
    <html lang="en" style={cssVars}>
      <body className={`${exo2.variable} antialiased`}>
        <ConfigProvider config={config}>
          <div className="flex flex-col justify-between min-h-screen">
            <Header brand={brand} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}
