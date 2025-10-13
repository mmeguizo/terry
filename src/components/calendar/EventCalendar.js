"use client";

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';
import { useConfig } from '@/context/ConfigContext';

const EventCalendar = ({ events = [], onEventClick, showToolbar = true }) => {
  const router = useRouter();
  const config = useConfig();
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    // Transform events to FullCalendar format
    const transformed = events.map(event => ({
      id: event.id || event.eventId,
      title: event.title || event.eventName || event.name,
      start: event.startDate || event.date || event.event_datetime_start,
      end: event.endDate || event.event_datetime_finish,
      url: `/event/${event.id || event.eventId}`,
      extendedProps: {
        location: event.location || event.venue_name,
        description: event.description,
        categories: event.categories || [],
      },
      backgroundColor: config.primaryColor || '#3b82f6',
      borderColor: config.primaryColor || '#3b82f6',
      textColor: '#ffffff',
    }));

    setCalendarEvents(transformed);
  }, [events, config.primaryColor]);

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault(); // Prevent default link behavior
    
    if (onEventClick) {
      onEventClick(info.event);
    } else {
      // Navigate to event page
      const eventId = info.event.id;
      router.push(`/event/${eventId}`);
    }
  };

  const handleDateClick = (info) => {
    console.log('Date clicked:', info.dateStr);
    // Could add ability to filter events by date or other functionality
  };

  return (
    <div className="event-calendar-wrapper">
      <style jsx global>{`
        .event-calendar-wrapper {
          --fc-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-bg-color: ${config.primaryColor || '#3b82f6'};
          --fc-button-border-color: ${config.primaryColor || '#3b82f6'};
          --fc-button-hover-bg-color: ${config.primaryColor || '#3b82f6'}dd;
          --fc-button-hover-border-color: ${config.primaryColor || '#3b82f6'}dd;
          --fc-button-active-bg-color: ${config.primaryColor || '#3b82f6'}bb;
          --fc-button-active-border-color: ${config.primaryColor || '#3b82f6'}bb;
          --fc-today-bg-color: ${config.primaryColor || '#3b82f6'}10;
        }

        .fc {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .fc-toolbar-title {
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          color: ${config.textColor || '#1a1a1a'} !important;
        }

        .fc-button {
          text-transform: capitalize !important;
          font-weight: 600 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.2s ease !important;
        }

        .fc-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .fc-daygrid-day-number {
          color: ${config.textColor || '#1a1a1a'} !important;
          font-weight: 600 !important;
        }

        .fc-col-header-cell-cushion {
          color: ${config.textColor || '#1a1a1a'} !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          padding: 0.5rem !important;
        }

        .fc-event {
          cursor: pointer !important;
          border-radius: 0.375rem !important;
          padding: 0.25rem 0.5rem !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }

        .fc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .fc-daygrid-event-dot {
          display: none !important;
        }

        .fc-day-today {
          background: var(--fc-today-bg-color) !important;
        }

        .fc-daygrid-day-frame {
          min-height: 100px !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .fc-toolbar {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }

          .fc-toolbar-chunk {
            margin: 0.25rem 0 !important;
          }

          .fc-toolbar-title {
            font-size: 1.25rem !important;
          }

          .fc-button {
            padding: 0.375rem 0.75rem !important;
            font-size: 0.875rem !important;
          }

          .fc-daygrid-day-frame {
            min-height: 60px !important;
          }
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={showToolbar ? {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        } : false}
        events={calendarEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        weekends={true}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.5}
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short'
        }}
        eventContent={(eventInfo) => {
          return (
            <div className="fc-event-main-frame">
              <div className="fc-event-time">{eventInfo.timeText}</div>
              <div className="fc-event-title-container">
                <div className="fc-event-title fc-sticky">
                  {eventInfo.event.title}
                </div>
              </div>
            </div>
          );
        }}
        // Add more configuration as needed
      />
    </div>
  );
};

export default EventCalendar;

