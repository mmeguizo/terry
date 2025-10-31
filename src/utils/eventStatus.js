/**
 * Calculate the current status of an event based on dates
 * @param {Object} event - Event object with date fields
 * @returns {string} - One of: "entries-opening-soon", "entries-open", "entries-closed", "event-live", "event-past"
 */
export function calculateEventStatus(event) {
  // If API provides a status, use it if valid
  const apiStatus = event?.eventStatus || event?.event_status || event?.status;
  const validStatuses = ['entries-opening-soon', 'entries-open', 'entries-closed', 'event-live', 'event-past'];
  if (apiStatus && validStatuses.includes(apiStatus)) {
    return apiStatus;
  }

  const now = new Date();
  
  // Parse dates
  const entriesOpenDate = event?.entriesOpenDate ? new Date(event.entriesOpenDate) : null;
  const entriesCloseDate = event?.entriesCloseDate ? new Date(event.entriesCloseDate) : null;
  const startDate = event?.startDate ? new Date(event.startDate) : null;
  const endDate = event?.endDate ? new Date(event.endDate) : null;

  // Check if event has ended
  if (endDate && now > endDate) {
    return 'event-past';
  }

  // Check if event is currently happening
  if (startDate && endDate && now >= startDate && now <= endDate) {
    return 'event-live';
  }

  // Check entries status
  if (entriesOpenDate && entriesCloseDate) {
    if (now < entriesOpenDate) {
      return 'entries-opening-soon';
    }
    if (now >= entriesOpenDate && now < entriesCloseDate) {
      return 'entries-open';
    }
    if (now >= entriesCloseDate) {
      return 'entries-closed';
    }
  }

  // Fallback: if we have a start date and we're before it
  if (startDate && now < startDate) {
    return 'entries-opening-soon';
  }

  // Default fallback
  return 'entries-closed';
}

/**
 * Get a human-readable status message
 * @param {string} status - Status from calculateEventStatus
 * @returns {Object} - { message, color, icon }
 */
export function getStatusDisplay(status) {
  const displays = {
    'entries-opening-soon': {
      message: 'Entries Opening Soon',
      color: 'blue',
      icon: 'clock',
    },
    'entries-open': {
      message: 'Entries Open',
      color: 'green',
      icon: 'check',
    },
    'entries-closed': {
      message: 'Entries Closed',
      color: 'red',
      icon: 'x',
    },
    'event-live': {
      message: 'Event Happening Now',
      color: 'orange',
      icon: 'live',
    },
    'event-past': {
      message: 'Event Concluded',
      color: 'gray',
      icon: 'archive',
    },
  };

  return displays[status] || displays['entries-closed'];
}

/**
 * Calculate time remaining until a target date
 * @param {Date|string} targetDate - Target date
 * @returns {Object} - { days, hours, minutes, seconds, total }
 */
export function getTimeRemaining(targetDate) {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const total = target - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

