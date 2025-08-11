import { Exo_2 } from "next/font/google";
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
    // Use SITE_DOMAIN from env or fallback to localhost
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
      
    const res = await fetch(`${baseUrl}/api/config`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("API returned non-200");

    return await res.json();
  } catch (error) {
    console.warn("Falling back to local JSON config:", error);
    const configModule = await import("@/config/site-config.json");
    return configModule.default;
  }
}

export async function generateMetadata() {
  try {
    // Use SITE_DOMAIN from env or fallback to localhost
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/config`, {
      cache: "no-store",
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

  return (
    <html lang="en">
      <body className={`${exo2.variable} antialiased`}>
        <ConfigProvider config={config}>
          <div className="flex flex-col justify-between min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}
