"use client";

import { useState, useEffect } from 'react';
import { useConfig } from '@/context/ConfigContext';

const EventWeather = ({ location, lat, lon, showForecast = true, compact = false }) => {
  const config = useConfig();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location && (!lat || !lon)) {
        setError('No location provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (lat && lon) {
          params.append('lat', lat);
          params.append('lon', lon);
        } else {
          params.append('location', location);
        }

        const response = await fetch(`/api/weather?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, lat, lon]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white/10 rounded-2xl p-6">
          <div className="h-8 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Silently fail - weather is not critical
  }

  const { current, forecast, location: loc } = weather;

  // Compact view for hero section
  if (compact) {
    return (
      <div 
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'}20 0%, rgba(255, 255, 255, 0.1) 100%)`
        }}
      >
        <img 
          src={current.condition.icon} 
          alt={current.condition.text}
          className="w-8 h-8"
        />
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {Math.round(current.temp_c)}°
          </span>
          <span className="text-sm text-white/80">
            {current.condition.text}
          </span>
        </div>
      </div>
    );
  }

  // Full weather widget
  return (
    <div 
      className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'}15 0%, rgba(0, 0, 0, 0.5) 100%)`
      }}
    >
      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-2xl font-bold mb-1">
              {loc.name}
            </h3>
            <p className="text-white/70 text-sm">
              {loc.region}, {loc.country}
            </p>
          </div>
          <img 
            src={current.condition.icon} 
            alt={current.condition.text}
            className="w-16 h-16"
          />
        </div>

        <div className="flex items-end gap-4">
          <div>
            <div className="text-5xl font-bold text-white">
              {Math.round(current.temp_c)}°C
            </div>
            <div className="text-white/80 text-lg mt-1">
              {current.condition.text}
            </div>
          </div>
          <div className="text-white/60 text-sm pb-2">
            Feels like {Math.round(current.feelslike_c)}°C
          </div>
        </div>

        {/* Current conditions grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/60 text-xs mb-1">Wind</div>
            <div className="text-white font-semibold">
              {Math.round(current.wind_kph)} km/h
            </div>
            <div className="text-white/50 text-xs">{current.wind_dir}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/60 text-xs mb-1">Humidity</div>
            <div className="text-white font-semibold">{current.humidity}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/60 text-xs mb-1">Rain</div>
            <div className="text-white font-semibold">
              {current.precip_mm} mm
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/60 text-xs mb-1">Pressure</div>
            <div className="text-white font-semibold">
              {current.pressure_mb} mb
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {showForecast && forecast && forecast.length > 0 && (
        <div>
          <h4 className="text-white font-semibold mb-3">7-Day Forecast</h4>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day, index) => {
              const date = new Date(day.date);
              const dayName = index === 0 
                ? 'Today' 
                : date.toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div 
                  key={day.date}
                  className="bg-white/10 rounded-lg p-2 backdrop-blur-sm text-center hover:bg-white/20 transition-colors duration-200"
                >
                  <div className="text-white/70 text-xs mb-2">{dayName}</div>
                  <img 
                    src={day.day.condition.icon} 
                    alt={day.day.condition.text}
                    className="w-10 h-10 mx-auto mb-2"
                  />
                  <div className="text-white font-semibold text-sm">
                    {Math.round(day.day.maxtemp_c)}°
                  </div>
                  <div className="text-white/50 text-xs">
                    {Math.round(day.day.mintemp_c)}°
                  </div>
                  {day.day.daily_chance_of_rain > 30 && (
                    <div className="text-blue-300 text-xs mt-1">
                      💧 {day.day.daily_chance_of_rain}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last updated */}
      <div className="text-white/40 text-xs mt-4 text-center">
        Updated: {new Date(loc.localtime).toLocaleString()}
      </div>
    </div>
  );
};

export default EventWeather;

