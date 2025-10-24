import { LinkButton, IconLinkButton } from "@/components/ui/Links";
import SectionTitle from "@/components/SectionTitle";
import { HiChevronRight, HiCalendarDays, HiMapPin, HiClock, HiInformationCircle, HiUserGroup, HiDocumentText, HiFlag } from "react-icons/hi2";

async function getConfig() {
  try {
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

async function getEventData(eventId) {
  if (!eventId) return null;
  
  try {
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/raceready/event/${eventId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("Failed to fetch event data:", error);
    return null;
  }
}

function getEventState(eventData) {
  // This will be updated when the API is rolled out
  // For now, return a placeholder state
  if (!eventData) return "upcoming_notopen";
  
  // TODO: Use actual eventState from API when available
  // eventState: "live" | "completed" | "upcoming_open" | "upcoming_closed" | "upcoming_notopen"
  return eventData.eventState || "upcoming_notopen";
}

function getEntryCountdown(eventData, eventState) {
  // TODO: Implement countdown to entry opening when API is updated
  if (eventState === "upcoming_notopen" && eventData?.entriesOpenAt) {
    const now = new Date().getTime();
    const openTime = new Date(eventData.entriesOpenAt).getTime();
    const difference = openTime - now;
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      
      return { days, hours, minutes, isActive: true };
    }
  }
  
  return { days: 0, hours: 0, minutes: 0, isActive: false };
}

export default async function EventInfoPage() {
  const config = await getConfig();
  const eventData = await getEventData(config.currentEventId);
  const eventState = getEventState(eventData);
  const entryCountdown = getEntryCountdown(eventData, eventState);
  
  const formatEventDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatEventTime = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "TBA";
    }
  };

  const getEventStateDisplay = (state) => {
    switch (state) {
      case "live": return { text: "Event Live", color: "bg-red-500", icon: "🔴" };
      case "completed": return { text: "Event Completed", color: "bg-gray-500", icon: "🏁" };
      case "upcoming_open": return { text: "Entries Open", color: "bg-green-500", icon: "✅" };
      case "upcoming_closed": return { text: "Entries Closed", color: "bg-orange-500", icon: "⏰" };
      case "upcoming_notopen": return { text: "Entries Not Open", color: "bg-blue-500", icon: "📅" };
      default: return { text: "Event Info", color: "bg-gray-500", icon: "ℹ️" };
    }
  };

  const stateDisplay = getEventStateDisplay(eventState);

  return (
    <main className="pt-16 md:pt-24" style={{ background: config.menuBackground || '#ffffff' }}>
      {/* Page Header - No Hero */}
      <section 
        className="border-b-2"
        style={{ 
          background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.primaryColor}05 100%)`,
          borderColor: config.primaryColor + '20' || '#e5e5e5'
        }}
      >
        <div className="container py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: config.textColor || '#000000' }}
              >
                {eventData?.name || config.hero?.eventName || "Event Information"}
              </h1>
              <div className="flex items-center gap-4">
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}DD 100%)`,
                    boxShadow: `0 4px 15px ${config.primaryColor}40`
                  }}
                >
                  <span className="mr-2">{stateDisplay.icon}</span>
                  {stateDisplay.text}
                </span>
                {eventData?.venue && (
                  <span 
                    className="flex items-center text-sm font-medium"
                    style={{ color: config.textColor + 'B0' || '#666666' }}
                  >
                    <HiMapPin className="w-4 h-4 mr-1" />
                    {eventData.venue}
                  </span>
                )}
              </div>
            </div>
            
            {/* Entry Action based on state */}
            <div className="flex flex-col items-end gap-2">
              {eventState === "upcoming_open" && (
                <div 
                  className="px-6 py-3 rounded-lg text-white font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}CC 100%)`,
                    boxShadow: `0 4px 15px ${config.primaryColor}40`
                  }}
                >
                  Enter Now
                </div>
              )}
              
              {eventState === "upcoming_notopen" && entryCountdown.isActive && (
                <div className="text-right">
                  <p 
                    className="text-sm font-medium mb-2"
                    style={{ color: config.textColor + '90' || '#666666' }}
                  >
                    Entries open in:
                  </p>
                  <div className="flex gap-2 text-sm font-mono">
                    <span 
                      className="px-3 py-2 rounded-lg font-bold text-white shadow-sm"
                      style={{ backgroundColor: config.primaryColor + 'DD' }}
                    >
                      {entryCountdown.days}d
                    </span>
                    <span 
                      className="px-3 py-2 rounded-lg font-bold text-white shadow-sm"
                      style={{ backgroundColor: config.primaryColor + 'DD' }}
                    >
                      {entryCountdown.hours}h
                    </span>
                    <span 
                      className="px-3 py-2 rounded-lg font-bold text-white shadow-sm"
                      style={{ backgroundColor: config.primaryColor + 'DD' }}
                    >
                      {entryCountdown.minutes}m
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* Event Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div 
                  className="rounded-xl p-6 shadow-lg border transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}08 100%)`,
                    borderColor: config.primaryColor + '20' || '#e5e5e5'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <HiCalendarDays 
                      className="w-6 h-6 mr-3" 
                      style={{ color: config.primaryColor || '#3b82f6' }}
                    />
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      Date
                    </h3>
                  </div>
                  <p 
                    className="font-medium"
                    style={{ color: config.textColor + 'B0' || '#666666' }}
                  >
                    {formatEventDate(eventData?.startDate || config.hero?.eventDate)}
                  </p>
                </div>

                <div 
                  className="rounded-xl p-6 shadow-lg border transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}08 100%)`,
                    borderColor: config.primaryColor + '20' || '#e5e5e5'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <HiUserGroup 
                      className="w-6 h-6 mr-3" 
                      style={{ color: config.primaryColor || '#10b981' }}
                    />
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      Entries
                    </h3>
                  </div>
                  <p 
                    className="font-medium"
                    style={{ color: config.textColor + 'B0' || '#666666' }}
                  >
                    {eventData?.entries?.length || 0} competitors
                  </p>
                </div>

                <div 
                  className="rounded-xl p-6 shadow-lg border transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}08 100%)`,
                    borderColor: config.primaryColor + '20' || '#e5e5e5'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <HiFlag 
                      className="w-6 h-6 mr-3" 
                      style={{ color: config.primaryColor || '#8b5cf6' }}
                    />
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      Categories
                    </h3>
                  </div>
                  <p 
                    className="font-medium"
                    style={{ color: config.textColor + 'B0' || '#666666' }}
                  >
                    {eventData?.categories?.length || 0} classes
                  </p>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-12">
                <h2 
                  className="text-2xl font-bold mb-6 uppercase tracking-wider"
                  style={{ color: config.textColor || '#000000' }}
                >
                  About This Event
                  <div 
                    className="w-16 h-1 mt-3 rounded-full"
                    style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                  ></div>
                </h2>
                <div 
                  className="rounded-xl p-8 shadow-lg border"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}05 100%)`,
                    borderColor: config.primaryColor + '20' || '#e5e5e5'
                  }}
                >
                  {eventData?.description ? (
                    <div 
                      className="leading-relaxed"
                      style={{ color: config.textColor + 'E0' || '#374151' }}
                      dangerouslySetInnerHTML={{ __html: eventData.description }} 
                    />
                  ) : (
                    <div>
                      <p 
                        className="leading-relaxed mb-6"
                        style={{ color: config.textColor + 'E0' || '#374151' }}
                      >
                        Join us for an exciting motorsport event featuring world-class racing action. 
                        {(eventData?.name || config.hero?.eventName) && ` ${eventData?.name || config.hero?.eventName} promises to deliver thrilling competition and unforgettable moments.`}
                      </p>
                      <p 
                        className="leading-relaxed"
                        style={{ color: config.textColor + 'E0' || '#374151' }}
                      >
                        Whether you&apos;re a seasoned motorsport fan or new to racing, this event offers something for everyone. 
                        Don&apos;t miss your chance to witness high-speed action at {eventData?.venue || config.hero?.eventLocation || "this premier venue"}.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {eventData?.categories && eventData.categories.length > 0 && (
                <div className="mb-12">
                  <SectionTitle>Event Categories</SectionTitle>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {eventData.categories.map((category, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-neutral-200 shadow-sm">
                        <h4 className="font-semibold text-neutral-900">{category}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Information */}
              <div className="mt-12">
                <SectionTitle>Important Information</SectionTitle>
                <div className="grid gap-4 mt-6">
                  <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                    <div className="flex items-start">
                      <HiInformationCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Spectator Entry</h4>
                        <p className="text-blue-800 text-sm">
                          Gates open 1 hour before the first session. Please arrive early to secure parking and find your viewing area.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-600">
                    <div className="flex items-start">
                      <HiClock className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Schedule Updates</h4>
                        <p className="text-amber-800 text-sm">
                          Event schedules may change due to weather or track conditions. Check our social media for real-time updates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {eventState === "upcoming_open" && (
                    <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                      <div className="flex items-start">
                        <HiUserGroup className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-900 mb-2">Entries Now Open</h4>
                          <p className="text-green-800 text-sm">
                            Event entries are currently open. Don&apos;t miss your chance to compete - register now!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Entry Status Card */}
              <div 
                className="rounded-xl p-6 shadow-lg border mb-8"
                style={{ 
                  background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}08 100%)`,
                  borderColor: config.primaryColor + '20' || '#e5e5e5'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: config.textColor || '#000000' }}
                >
                  Entry Status
                </h3>
                <div className="space-y-4">
                  <div 
                    className="p-4 rounded-lg border-l-4 shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.primaryColor}08 100%)`,
                      borderColor: config.primaryColor || '#3b82f6'
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{stateDisplay.icon}</span>
                      <span 
                        className="font-medium"
                        style={{ color: config.textColor || '#000000' }}
                      >
                        {stateDisplay.text}
                      </span>
                    </div>
                  </div>
                  
                  {eventState === "upcoming_open" && (
                    <div 
                      className="px-4 py-3 rounded-lg text-white font-bold text-center uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
                      style={{ 
                        background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}CC 100%)`,
                        boxShadow: `0 4px 15px ${config.primaryColor}40`
                      }}
                    >
                      Enter Event
                    </div>
                  )}

                  {eventState === "upcoming_notopen" && entryCountdown.isActive && (
                    <div 
                      className="text-center p-4 rounded-lg"
                      style={{ backgroundColor: config.primaryColor + '10' }}
                    >
                      <p 
                        className="text-sm font-medium mb-2"
                        style={{ color: config.primaryColor }}
                      >
                        Entries open in:
                      </p>
                      <div className="flex justify-center gap-2 text-sm font-mono">
                        <span 
                          className="px-3 py-2 rounded shadow text-white font-bold"
                          style={{ backgroundColor: config.primaryColor + 'DD' }}
                        >
                          {entryCountdown.days}d
                        </span>
                        <span 
                          className="px-3 py-2 rounded shadow text-white font-bold"
                          style={{ backgroundColor: config.primaryColor + 'DD' }}
                        >
                          {entryCountdown.hours}h
                        </span>
                        <span 
                          className="px-3 py-2 rounded shadow text-white font-bold"
                          style={{ backgroundColor: config.primaryColor + 'DD' }}
                        >
                          {entryCountdown.minutes}m
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Navigation */}
              <div 
                className="rounded-xl p-6 shadow-lg border mb-8"
                style={{ 
                  background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}08 100%)`,
                  borderColor: config.primaryColor + '20' || '#e5e5e5'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: config.textColor || '#000000' }}
                >
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {config.currentEventId && (
                    <div 
                      className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm"
                      style={{ 
                        background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.primaryColor}08 100%)`,
                        borderLeft: `4px solid ${config.primaryColor}`
                      }}
                    >
                      <HiChevronRight 
                        className="w-4 h-4 mr-2" 
                        style={{ color: config.primaryColor }}
                      />
                      <span 
                        className="font-medium"
                        style={{ color: config.textColor || '#000000' }}
                      >
                        Live Event Page
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.primaryColor}08 100%)`,
                      borderLeft: `4px solid ${config.primaryColor}`
                    }}
                  >
                    <HiChevronRight 
                      className="w-4 h-4 mr-2" 
                      style={{ color: config.primaryColor }}
                    />
                    <span 
                      className="font-medium"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      All Events
                    </span>
                  </div>
                  
                  <div 
                    className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.primaryColor}08 100%)`,
                      borderLeft: `4px solid ${config.primaryColor}`
                    }}
                  >
                    <HiChevronRight 
                      className="w-4 h-4 mr-2" 
                      style={{ color: config.primaryColor }}
                    />
                    <span 
                      className="font-medium"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      Latest News
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Documents */}
              {((eventData?.documents && eventData.documents.length > 0) || (config.eventDocuments && config.eventDocuments.length > 0)) && (
                <div 
                  className="rounded-xl p-6 shadow-lg border"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.menuBackground || '#ffffff'} 0%, ${config.primaryColor}08 100%)`,
                    borderColor: config.primaryColor + '20' || '#e5e5e5'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <HiDocumentText 
                      className="w-5 h-5 mr-2" 
                      style={{ color: config.primaryColor || '#3b82f6' }}
                    />
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      Event Documents
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {(eventData?.documents || config.eventDocuments || []).slice(0, 6).map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${config.primaryColor}10 0%, ${config.primaryColor}05 100%)`,
                          borderLeft: `3px solid ${config.primaryColor}60`
                        }}
                      >
                        <HiDocumentText 
                          className="w-4 h-4 mr-3 flex-shrink-0" 
                          style={{ color: config.primaryColor + 'B0' }}
                        />
                        <span 
                          className="text-sm font-medium truncate"
                          style={{ color: config.textColor || '#000000' }}
                        >
                          {doc.label || doc.name || `Document ${index + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  const config = await getConfig();
  
  return {
    title: `Event Information | ${config.siteTitle || 'Motorsport Event'}`,
    description: `Complete information about ${config.hero?.eventName || 'our upcoming motorsport event'} including dates, location, and important details.`,
    openGraph: {
      title: `Event Information | ${config.siteTitle || 'Motorsport Event'}`,
      description: `Complete information about ${config.hero?.eventName || 'our upcoming motorsport event'} including dates, location, and important details.`,
      type: 'website',
    },
  };
}
