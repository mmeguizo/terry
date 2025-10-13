import { Exo_2 } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import PageOpener from "@/components/layout/PageOpener";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ConfigProvider from "@/context/ConfigProvider";
import PerformanceMonitor from "@/components/debug/PerformanceMonitor";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import NotificationManager from "@/components/pwa/NotificationManager";
import NetworkStatus from "@/components/pwa/NetworkStatus";
import ErrorBoundary from "@/components/error/ErrorBoundary";

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={config.primaryColor || '#3b82f6'} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={config.siteTitle || 'RaceReady'} />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      <body className={`${exo2.variable} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 rounded">Skip to content</a>
        <ConfigProvider config={config}>
          <ErrorBoundary context="app" level="page">
            <div className="flex flex-col justify-between min-h-screen">
              <PageOpener />
              <ErrorBoundary context="navigation" level="component">
                <Header />
              </ErrorBoundary>
              <ErrorBoundary context="content" level="component">
                <main id="main" className="flex-grow">{children}</main>
              </ErrorBoundary>
              <ErrorBoundary context="footer" level="component">
                <Footer />
              </ErrorBoundary>
              <PerformanceMonitor />
              <InstallPrompt />
              <NotificationManager />
              <NetworkStatus />
              <MobileBottomNav />
            </div>
          </ErrorBoundary>
        </ConfigProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize global error handling
              if (typeof window !== 'undefined') {
                // Handle unhandled promise rejections
                window.addEventListener('unhandledrejection', function(event) {
                  console.error('🚨 Unhandled Promise Rejection:', event.reason);
                  // Prevent default browser error handling
                  event.preventDefault();
                });

                // Handle global JavaScript errors
                window.addEventListener('error', function(event) {
                  console.error('🚨 Global JavaScript Error:', event.error);
                });
              }

              // Register service worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('🏁 RaceReady SW registered:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('🚨 SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
