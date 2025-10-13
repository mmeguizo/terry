import { NextResponse } from 'next/server';

// Weather API endpoint
// Free API from OpenWeatherMap - sign up at https://openweathermap.org/api
// Or use weatherapi.com for a simpler free tier

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!location && (!lat || !lon)) {
    return NextResponse.json(
      { error: 'Location or coordinates required' },
      { status: 400 }
    );
  }

  // Use WeatherAPI.com (free tier: 1M calls/month)
  // Sign up at: https://www.weatherapi.com/signup.aspx
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo'; // Replace with your key

  try {
    let weatherUrl;
    
    if (lat && lon) {
      // Use coordinates
      weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
    } else {
      // Use location name
      weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no`;
    }

    const response = await fetch(weatherUrl, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      console.error('Weather API error:', response.status);
      return NextResponse.json(
        { error: 'Weather service unavailable', status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Transform to our format
    const weatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        localtime: data.location.localtime,
      },
      current: {
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        condition: {
          text: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`,
          code: data.current.condition.code,
        },
        wind_kph: data.current.wind_kph,
        wind_dir: data.current.wind_dir,
        pressure_mb: data.current.pressure_mb,
        precip_mm: data.current.precip_mm,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        feelslike_c: data.current.feelslike_c,
        feelslike_f: data.current.feelslike_f,
        uv: data.current.uv,
      },
      forecast: data.forecast.forecastday.map(day => ({
        date: day.date,
        day: {
          maxtemp_c: day.day.maxtemp_c,
          maxtemp_f: day.day.maxtemp_f,
          mintemp_c: day.day.mintemp_c,
          mintemp_f: day.day.mintemp_f,
          avgtemp_c: day.day.avgtemp_c,
          avgtemp_f: day.day.avgtemp_f,
          condition: {
            text: day.day.condition.text,
            icon: `https:${day.day.condition.icon}`,
          },
          maxwind_kph: day.day.maxwind_kph,
          totalprecip_mm: day.day.totalprecip_mm,
          daily_chance_of_rain: day.day.daily_chance_of_rain,
          daily_chance_of_snow: day.day.daily_chance_of_snow,
          avghumidity: day.day.avghumidity,
          uv: day.day.uv,
        },
        hour: day.hour.map(h => ({
          time: h.time,
          temp_c: h.temp_c,
          temp_f: h.temp_f,
          condition: {
            text: h.condition.text,
            icon: `https:${h.condition.icon}`,
          },
          wind_kph: h.wind_kph,
          precip_mm: h.precip_mm,
          humidity: h.humidity,
          cloud: h.cloud,
          chance_of_rain: h.chance_of_rain,
        })),
      })),
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API exception:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: error.message },
      { status: 500 }
    );
  }
}

