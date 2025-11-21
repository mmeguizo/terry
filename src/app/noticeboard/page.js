"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { HiChevronRight, HiDownload } from "react-icons/hi2";
import Link from "next/link";

export default function NoticeboardPage() {
  const config = useConfig();
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

  const documents = nextEvent?.documents || config.eventDocuments || [];

  return (
    <main className="min-h-screen pt-24">
      <section
        className="py-16 xl:py-20"
        style={{ background: config.menuBackground || '#ffffff' }}
      >
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-3xl xl:text-4xl 2xl:text-5xl font-normal mb-4 uppercase tracking-wider"
              style={{ color: config.textColor || '#000000' }}
            >
              Noticeboard
              <span
                className="block w-24 h-1 mx-auto mt-4 rounded-full"
                style={{ background: `linear-gradient(90deg, ${config.primaryColor}, ${config.primaryColor}80)` }}
              ></span>
            </h1>
            <p
              className="text-base xl:text-lg max-w-2xl mx-auto"
              style={{ color: config.textColor || '#000000' }}
            >
              Official event documents, supplementary regulations, and important notices
            </p>
          </div>

          {/* Event Info */}
          {nextEvent && (
            <div className="mb-8 p-6 bg-white/80 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-2" style={{ color: config.primaryColor }}>
                {nextEvent.name || nextEvent.title}
              </h2>
              <p className="text-sm text-gray-600">
                {nextEvent.location || nextEvent.venue} • {new Date(nextEvent.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Documents List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: config.primaryColor }}></div>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((doc, index) => {
                const docName = doc.name || doc.title || doc.label || `Document ${index + 1}`;
                const docUrl = doc.url || doc.link || '#';
                const docDate = doc.date || doc.updated_at;

                return (
                  <Link
                    key={index}
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 xl:p-5 bg-white/80 rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-lg"
                        style={{ backgroundColor: `${config.primaryColor}20` }}
                      >
                        <HiDownload className="text-xl" style={{ color: config.primaryColor }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base xl:text-lg group-hover:text-gray-900 transition-colors" style={{ color: config.textColor || '#1a1a1a' }}>
                          {docName}
                        </h3>
                        {docDate && (
                          <p className="text-sm text-gray-500 mt-1">
                            Updated: {new Date(docDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <HiChevronRight
                      className="text-2xl text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No documents available at this time.</p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-md"
              style={{ color: config.textColor || '#1a1a1a' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
