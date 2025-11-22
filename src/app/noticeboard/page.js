"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { HiArrowDownTray, HiDocumentText } from "react-icons/hi2";
import Link from "next/link";

export default function NoticeboardPage() {
  const { config } = useConfig();
  const [nextEvent, setNextEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const response = await fetch('/api/raceready-events?view=next');
        if (response.ok) {
          const data = await response.json();
          setNextEvent(data);
        }
      } catch (error) {
        console.warn('Failed to fetch next event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  const documents = nextEvent?.documents || config?.eventDocuments || [];

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal uppercase tracking-wider mb-4 text-white">
            Noticeboard
          </h1>
          <div
            className="w-24 h-1 mb-6 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${config?.primaryColor || '#dc2626'}, transparent)`
            }}
          />
          <p className="text-base text-neutral-400">
            Official event documents and important notices
          </p>
        </div>

        {/* Event Info Banner */}
        {nextEvent && (
          <div
            className="mb-8 p-6 rounded-lg backdrop-blur-sm border relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: `${config?.primaryColor || '#dc2626'}40`
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-20 blur-xl"
              style={{
                background: `radial-gradient(circle at 0% 0%, ${config?.primaryColor || '#dc2626'}, transparent 70%)`
              }}
            />

            <div className="relative">
              <h2
                className="text-xl font-medium mb-1"
                style={{ color: config?.primaryColor || '#dc2626' }}
              >
                {nextEvent.name || nextEvent.title}
              </h2>
              <p className="text-sm text-neutral-400">
                {nextEvent.location || nextEvent.venue} • {nextEvent.date || new Date(nextEvent.startDate).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        )}

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: config?.primaryColor || '#dc2626' }}
            />
          </div>
        ) : documents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => {
              const docName = doc.name || doc.title || doc.label || `Document ${index + 1}`;
              const docUrl = doc.url || doc.link || '#';

              return (
                <Link
                  key={index}
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative backdrop-blur-sm rounded-lg border transition-all duration-300 hover:scale-105 overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${config?.primaryColor || '#dc2626'}40, transparent 70%)`
                    }}
                  />

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden"
                      style={{
                        backgroundColor: `${config?.primaryColor || '#dc2626'}15`
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${config?.primaryColor || '#dc2626'}30, transparent)`
                        }}
                      />
                      <HiDocumentText
                        className="text-2xl relative z-10"
                        style={{ color: config?.primaryColor || '#dc2626' }}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-base text-white mb-3 leading-tight">
                      {docName}
                    </h3>

                    {/* Download indicator */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-wider">
                      <HiArrowDownTray className="text-sm" />
                      <span>Download</span>
                    </div>

                    {/* Arrow */}
                    <div className="absolute top-6 right-6">
                      <svg
                        className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${config?.primaryColor || '#dc2626'}, transparent)`
                    }}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div
              className="inline-flex flex-col items-center gap-6 p-12 backdrop-blur-sm rounded-lg border relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 opacity-20 blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${config?.primaryColor || '#dc2626'}20, transparent 70%)`
                }}
              />

              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: `${config?.primaryColor || '#dc2626'}15` }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${config?.primaryColor || '#dc2626'}20, transparent)`
                    }}
                  />
                  <HiDocumentText
                    className="text-4xl relative z-10"
                    style={{ color: config?.primaryColor || '#dc2626' }}
                  />
                </div>
              </div>

              <div className="relative">
                <p className="text-white font-medium mb-2 text-lg">
                  No documents available
                </p>
                <p className="text-sm text-neutral-500">
                  Event documents will appear here when available
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
