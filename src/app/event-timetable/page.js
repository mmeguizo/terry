"use client";
import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { HiCalendar, HiClock, HiLocationMarker } from "react-icons/hi";
import Link from "next/link";

export default function EventTimetablePage() {
  const { config } = useConfig();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        setLoading(true);
        const response = await fetch('/api/raceready-events?view=next');

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNextEvent();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  function formatTime(timeString) {
    if (!timeString) return '';
    try {
      // Handle various time formats
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-AU', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  }

  function groupSessionsByDay(sessions) {
    if (!sessions || sessions.length === 0) return {};

    const grouped = {};
    sessions.forEach(session => {
      const date = session.date || session.day || 'TBD';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });

    return grouped;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 pt-32 pb-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                <div className="h-32 bg-neutral-200 rounded"></div>
                <div className="h-32 bg-neutral-200 rounded"></div>
                <div className="h-32 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-neutral-50 pt-32 pb-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-normal uppercase mb-8 tracking-wider">
              Event Timetable
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
              <p className="text-neutral-600">
                {error ? `Error: ${error}` : 'No event timetable available at this time.'}
              </p>
              <Link
                href="/events"
                className="inline-block mt-6 text-sm uppercase font-medium hover:underline"
                style={{ color: config?.primaryColor || '#1c9aef' }}
              >
                ← Back to Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const sessionsByDay = groupSessionsByDay(event.sessions);
  const hasSessions = Object.keys(sessionsByDay).length > 0;

  const venueName = typeof event.venue === 'string'
    ? event.venue
    : event.venue?.name || event.venue?.display || event.location || 'Venue TBA';

  return (
    <main className="min-h-screen bg-neutral-50 pt-32 pb-20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal uppercase mb-4 tracking-wider">
              Event Timetable
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-neutral-700 mb-6">
              {event.name || event.title}
            </h2>

            {/* Event Info */}
            <div className="flex flex-wrap gap-6 text-neutral-600">
              {venueName && (
                <div className="flex items-center gap-2">
                  <HiLocationMarker className="w-5 h-5" style={{ color: config?.primaryColor || '#1c9aef' }} />
                  <span className="text-sm md:text-base font-medium">{venueName}</span>
                </div>
              )}
              {event.date && (
                <div className="flex items-center gap-2">
                  <HiCalendar className="w-5 h-5" style={{ color: config?.primaryColor || '#1c9aef' }} />
                  <span className="text-sm md:text-base font-medium">{event.date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timetable Content */}
          {hasSessions ? (
            <div className="space-y-8">
              {Object.entries(sessionsByDay).map(([day, sessions]) => (
                <div key={day} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                  {/* Day Header */}
                  <div
                    className="px-6 py-4"
                    style={{ backgroundColor: config?.primaryColor || '#1c9aef' }}
                  >
                    <h3 className="text-xl font-medium uppercase text-white tracking-wide">
                      {formatDate(day)}
                    </h3>
                  </div>

                  {/* Sessions */}
                  <div className="divide-y divide-neutral-200">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="px-6 py-5 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Time */}
                          <div className="flex items-center gap-2 sm:w-40 flex-shrink-0">
                            <HiClock className="w-4 h-4 text-neutral-400" />
                            <span className="font-medium text-neutral-900">
                              {formatTime(session.startTime || session.time) || 'TBD'}
                              {session.endTime && ` - ${formatTime(session.endTime)}`}
                            </span>
                          </div>

                          {/* Session Info */}
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900 mb-1">
                              {session.name || session.title || session.session}
                            </h4>
                            {session.description && (
                              <p className="text-sm text-neutral-600">
                                {session.description}
                              </p>
                            )}
                            {session.category && (
                              <span
                                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium uppercase"
                                style={{
                                  backgroundColor: `${config?.primaryColor || '#1c9aef'}20`,
                                  color: config?.primaryColor || '#1c9aef'
                                }}
                              >
                                {session.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
              <p className="text-neutral-600 text-center">
                Event timetable will be published closer to the event date.
              </p>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm uppercase font-medium hover:underline"
              style={{ color: config?.primaryColor || '#1c9aef' }}
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
