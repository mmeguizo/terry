"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

const CalendarView = ({ events = [], config = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate || event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get all event dates
  const eventDates = useMemo(() => {
    const dates = new Set();
    events.forEach(event => {
      const eventDate = new Date(event.startDate || event.date);
      dates.add(eventDate.toDateString());
    });
    return dates;
  }, [events]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (day) => {
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clicked);
  };

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Format date range
  const fmtDateRange = (start, end) => {
    if (!start) return 'TBD';
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : startDate;

    if (startDate.getTime() === endDate.getTime()) {
      return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Build calendar days array
  const calendarDays = [];
  const totalDays = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase text-xs tracking-wide shadow-lg hover:shadow-xl transition-all duration-300">
              Month
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg font-bold uppercase text-xs tracking-wide transition-all duration-300">
              Week
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg font-bold uppercase text-xs tracking-wide transition-all duration-300">
              Day
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-neutral-100 border-b border-neutral-200">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="p-4 text-center font-bold text-sm text-neutral-700 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day !== null;
            const date = isCurrentMonth
              ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              : null;
            const hasEvents = date && eventDates.has(date.toDateString());
            const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();
            const isToday = date && date.toDateString() === new Date().toDateString();
            const dayEvents = date ? getEventsForDate(date) : [];

            return (
              <div
                key={index}
                onClick={() => isCurrentMonth && handleDateClick(day)}
                className={`min-h-32 p-3 border-b border-r border-neutral-200 transition-colors cursor-pointer ${
                  !isCurrentMonth ? 'bg-neutral-50' : ''
                } ${isSelected ? 'bg-red-50' : isToday ? 'bg-blue-50' : 'hover:bg-neutral-50'}`}
              >
                <div
                  className={`text-sm font-bold mb-2 ${
                    isToday ? 'text-blue-600' : isSelected ? 'text-red-600' : 'text-neutral-900'
                  }`}
                >
                  {day}
                </div>

                {/* Event dots/indicators */}
                {hasEvents && (
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-semibold truncate"
                      >
                        {event.name || event.title || event.eventName}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-neutral-500 px-2">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events List */}
      {selectedDate && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200 p-6">
            <h3 className="text-2xl font-bold text-neutral-900">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 text-lg">No events on this date</p>
            </div>
          ) : (
            <div className="grid gap-6 p-6">
              {selectedDateEvents.map((event, i) => {
                const venueName = typeof event.venue === 'string'
                  ? event.venue
                  : event.venue?.name || event.venue?.display || event.location || 'TBD';
                const eventDate = event.startDate || event.date;
                const eventStatus = eventDate ? (
                  new Date(eventDate) > new Date() ? 'Upcoming' : 'Past'
                ) : 'TBD';

                return (
                  <div
                    key={event.id ?? i}
                    className="group relative overflow-hidden border border-neutral-200 rounded-xl transition-all duration-300 hover:shadow-xl hover:border-red-300"
                  >
                    {/* Background gradient accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-500"></div>

                    {/* Content */}
                    <div className="relative p-8">
                      {/* Header row with status badge */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h2 className="text-3xl font-black uppercase text-neutral-900 mb-2 group-hover:text-red-600 transition-colors">
                            {event.name || event.title || 'Event'}
                          </h2>
                          <p className="text-sm text-neutral-600 font-medium uppercase tracking-wide">
                            {event.shortName || event.series || ''}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg font-bold uppercase text-xs whitespace-nowrap ${
                            eventStatus === 'Upcoming'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {eventStatus}
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Date Info */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-1">Date</p>
                            <p className="text-base font-bold text-neutral-900">
                              {event.date || fmtDateRange(event.startDate || event.date, event.endDate) || 'TBD'}
                            </p>
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100">
                              <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-1">Track</p>
                            <p className="text-base font-bold text-neutral-900">{venueName}</p>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a
                        href={`/event/${event.slug || event.id}`}
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        <span>View Details</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Info text */}
      {!selectedDate && events.length > 0 && (
        <div className="text-center py-8">
          <p className="text-neutral-500 text-lg">
            Click a date on the calendar to see events scheduled for that day
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
