const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'pressure_msl',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'visibility',
  'uv_index',
].join(',');

const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'is_day',
].join(',');

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_probability_max',
  'wind_speed_10m_max',
].join(',');

const AIR_FIELDS = [
  'european_aqi',
  'pm10',
  'pm2_5',
  'carbon_monoxide',
  'nitrogen_dioxide',
  'sulphur_dioxide',
  'ozone',
  'ammonia',
].join(',');

const WEATHER_CODES = {
  0: { day: 'Clear sky', night: 'Clear sky', iconDay: '☀', iconNight: '🌙' },
  1: { day: 'Mainly clear', night: 'Mainly clear', iconDay: '🌤', iconNight: '🌙' },
  2: { day: 'Partly cloudy', night: 'Partly cloudy', iconDay: '⛅', iconNight: '☁' },
  3: { day: 'Overcast', night: 'Overcast', iconDay: '☁', iconNight: '☁' },
  45: { day: 'Fog', night: 'Fog', iconDay: '🌫', iconNight: '🌫' },
  48: { day: 'Depositing rime fog', night: 'Depositing rime fog', iconDay: '🌫', iconNight: '🌫' },
  51: { day: 'Light drizzle', night: 'Light drizzle', iconDay: '🌦', iconNight: '🌧' },
  53: { day: 'Moderate drizzle', night: 'Moderate drizzle', iconDay: '🌦', iconNight: '🌧' },
  55: { day: 'Dense drizzle', night: 'Dense drizzle', iconDay: '🌧', iconNight: '🌧' },
  56: { day: 'Light freezing drizzle', night: 'Light freezing drizzle', iconDay: '🌧', iconNight: '🌧' },
  57: { day: 'Dense freezing drizzle', night: 'Dense freezing drizzle', iconDay: '🌧', iconNight: '🌧' },
  61: { day: 'Slight rain', night: 'Slight rain', iconDay: '🌦', iconNight: '🌧' },
  63: { day: 'Moderate rain', night: 'Moderate rain', iconDay: '🌧', iconNight: '🌧' },
  65: { day: 'Heavy rain', night: 'Heavy rain', iconDay: '🌧', iconNight: '🌧' },
  66: { day: 'Light freezing rain', night: 'Light freezing rain', iconDay: '🌧', iconNight: '🌧' },
  67: { day: 'Heavy freezing rain', night: 'Heavy freezing rain', iconDay: '🌧', iconNight: '🌧' },
  71: { day: 'Slight snow fall', night: 'Slight snow fall', iconDay: '🌨', iconNight: '🌨' },
  73: { day: 'Moderate snow fall', night: 'Moderate snow fall', iconDay: '🌨', iconNight: '🌨' },
  75: { day: 'Heavy snow fall', night: 'Heavy snow fall', iconDay: '❄', iconNight: '❄' },
  77: { day: 'Snow grains', night: 'Snow grains', iconDay: '❄', iconNight: '❄' },
  80: { day: 'Slight rain showers', night: 'Slight rain showers', iconDay: '🌦', iconNight: '🌧' },
  81: { day: 'Moderate rain showers', night: 'Moderate rain showers', iconDay: '🌧', iconNight: '🌧' },
  82: { day: 'Violent rain showers', night: 'Violent rain showers', iconDay: '⛈', iconNight: '⛈' },
  85: { day: 'Slight snow showers', night: 'Slight snow showers', iconDay: '🌨', iconNight: '🌨' },
  86: { day: 'Heavy snow showers', night: 'Heavy snow showers', iconDay: '❄', iconNight: '❄' },
  95: { day: 'Thunderstorm', night: 'Thunderstorm', iconDay: '⛈', iconNight: '⛈' },
  96: { day: 'Thunderstorm with slight hail', night: 'Thunderstorm with slight hail', iconDay: '⛈', iconNight: '⛈' },
  99: { day: 'Thunderstorm with heavy hail', night: 'Thunderstorm with heavy hail', iconDay: '⛈', iconNight: '⛈' },
};

async function req(url, params) {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${url}?${qs}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.reason || data.error || 'Unable to fetch weather data.');
  return data;
}

function getWeatherMeta(code, isDay) {
  const info = WEATHER_CODES[code] || WEATHER_CODES[3];
  return {
    description: isDay ? info.day : info.night,
    icon: isDay ? info.iconDay : info.iconNight,
  };
}

function toUnixSeconds(value) {
  return value ? Math.floor(new Date(value).getTime() / 1000) : 0;
}

function toAqiScale(europeanAqi) {
  if (europeanAqi == null) return null;
  if (europeanAqi <= 20) return 1;
  if (europeanAqi <= 40) return 2;
  if (europeanAqi <= 60) return 3;
  if (europeanAqi <= 80) return 4;
  return 5;
}

function normalizeLocation(location) {
  if (!location) return { name: 'Current location', country: '' };
  if (typeof location === 'string') return { name: location, country: '' };
  return {
    name: location.name || 'Current location',
    country: location.country || '',
  };
}

function buildCurrentWeather(forecast, location) {
  const current = forecast.current;
  const todayIndex = 0;
  const meta = getWeatherMeta(current.weather_code, current.is_day === 1);

  return {
    coord: {
      lat: forecast.latitude,
      lon: forecast.longitude,
    },
    name: location.name,
    sys: {
      country: location.country,
      sunrise: toUnixSeconds(forecast.daily?.sunrise?.[todayIndex]),
      sunset: toUnixSeconds(forecast.daily?.sunset?.[todayIndex]),
    },
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      temp_min: forecast.daily?.temperature_2m_min?.[todayIndex] ?? current.temperature_2m,
      temp_max: forecast.daily?.temperature_2m_max?.[todayIndex] ?? current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
    },
    weather: [
      {
        id: current.weather_code,
        description: meta.description,
        icon: meta.icon,
      },
    ],
    wind: {
      speed: current.wind_speed_10m,
      deg: current.wind_direction_10m,
      gust: current.wind_gusts_10m,
    },
    visibility: current.visibility ?? null,
    uvi: current.uv_index ?? forecast.daily?.uv_index_max?.[todayIndex] ?? null,
    isDay: current.is_day === 1,
  };
}

function buildAirPollution(airQuality) {
  const current = airQuality?.current;
  const scaledAqi = toAqiScale(current?.european_aqi);

  if (!current || !scaledAqi) return null;

  return {
    list: [
      {
        main: {
          aqi: scaledAqi,
        },
        components: {
          co: current.carbon_monoxide,
          no2: current.nitrogen_dioxide,
          o3: current.ozone,
          so2: current.sulphur_dioxide,
          pm2_5: current.pm2_5,
          pm10: current.pm10,
          nh3: current.ammonia,
        },
      },
    ],
  };
}

async function fetchAllData(lat, lon, location) {
  const [forecast, airQuality] = await Promise.all([
    req(FORECAST_BASE, {
      latitude: String(lat),
      longitude: String(lon),
      current: CURRENT_FIELDS,
      hourly: HOURLY_FIELDS,
      daily: DAILY_FIELDS,
      timezone: 'auto',
      forecast_days: '7',
      wind_speed_unit: 'ms',
    }),
    req(AIR_BASE, {
      latitude: String(lat),
      longitude: String(lon),
      current: AIR_FIELDS,
      timezone: 'auto',
    }).catch(() => null),
  ]);

  return {
    current: buildCurrentWeather(forecast, location),
    forecast,
    airPollution: buildAirPollution(airQuality),
  };
}

export async function getWeatherByCity(city) {
  const geo = await req(GEO_BASE, {
    name: city,
    count: '1',
    language: 'en',
    format: 'json',
  });

  const result = geo.results?.[0];
  if (!result) {
    throw new Error('City not found. Try a different search term.');
  }

  return fetchAllData(result.latitude, result.longitude, {
    name: result.name,
    country: result.country,
  });
}

export async function getCitySuggestions(query) {
  if (!query || query.length < 2) return [];

  try {
    const data = await req(GEO_BASE, {
      name: query,
      count: '5',
      language: 'en',
      format: 'json',
    });

    return (data.results || []).map((item) => ({
      name: item.name,
      state: item.admin1,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude,
    }));
  } catch {
    return [];
  }
}

export function getWeatherByCoords(lat, lon, location) {
  return fetchAllData(lat, lon, normalizeLocation(location));
}

export function processHourly(forecast) {
  const hourly = forecast.hourly;

  return hourly.time.slice(0, 9).map((time, index) => {
    const meta = getWeatherMeta(hourly.weather_code[index], hourly.is_day[index] === 1);

    return {
      dt: new Date(time).getTime(),
      label: new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true }).format(
        new Date(time)
      ),
      temp: Math.round(hourly.temperature_2m[index]),
      feelsLike: Math.round(hourly.apparent_temperature[index]),
      icon: meta.icon,
      condition: meta.description,
      pop: Math.round(hourly.precipitation_probability[index] || 0),
      humidity: hourly.relative_humidity_2m[index],
      wind: Math.round(hourly.wind_speed_10m[index] * 3.6),
    };
  });
}

export function processWeekly(forecast) {
  const daily = forecast.daily;

  return daily.time.slice(0, 7).map((time, index) => {
    const meta = getWeatherMeta(daily.weather_code[index], true);

    return {
      date: time,
      dt: new Date(time).getTime(),
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      dayTemp: Math.round(daily.temperature_2m_max[index]),
      nightTemp: Math.round(daily.temperature_2m_min[index]),
      pop: Math.round(daily.precipitation_probability_max[index] || 0),
      icon: meta.icon,
      condition: meta.description,
      wind: Math.round(daily.wind_speed_10m_max[index] * 3.6),
    };
  });
}

export function getAQIInfo(aqi) {
  const levels = [
    { label: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    { label: 'Fair', color: '#84cc16', bg: 'rgba(132,204,22,0.15)' },
    { label: 'Moderate', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
    { label: 'Poor', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
    { label: 'Very Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  ];
  return levels[Math.min((aqi || 1) - 1, 4)];
}

export function getWeatherGradient(weatherId, isDay) {
  const id = parseInt(weatherId, 10);

  if (id === 0) {
    return isDay
      ? ['#0f4c8a', '#1565c0', '#2196f3']
      : ['#050d1a', '#0a1628', '#0d1f3c'];
  }

  if (id >= 1 && id <= 3) {
    return isDay
      ? ['#1a3a6b', '#2a5298', '#3d72bc']
      : ['#0d1a2e', '#12233c', '#172d4e'];
  }

  if (id === 45 || id === 48) {
    return isDay
      ? ['#3d4f64', '#5a7088', '#7a90a8']
      : ['#1e2635', '#28333f', '#32404e'];
  }

  if ((id >= 51 && id <= 67) || (id >= 80 && id <= 82)) {
    return isDay
      ? ['#1e3245', '#2d4a6b', '#3d6490']
      : ['#111c2a', '#172438', '#1e3050'];
  }

  if ((id >= 71 && id <= 77) || id === 85 || id === 86) {
    return isDay
      ? ['#2d4a6b', '#4a7ba0', '#7aadc8']
      : ['#1a2a3d', '#243650', '#2d4668'];
  }

  if (id >= 95) {
    return isDay
      ? ['#1c2b4a', '#2d3f6b', '#3d5a8a']
      : ['#0d1520', '#141e32', '#1c2844'];
  }

  return isDay
    ? ['#2d3f55', '#3d5270', '#4d658a']
    : ['#151e2d', '#1c2738', '#222f42'];
}
