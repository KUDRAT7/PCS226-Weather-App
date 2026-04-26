import { useEffect, useRef, useState } from 'react';
import AirQuality from './components/AirQuality.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import SearchBar from './components/SearchBar.jsx';
import SunriseSunset from './components/SunriseSunset.jsx';
import WeatherDetails from './components/WeatherDetails.jsx';
import WeeklyForecast from './components/WeeklyForecast.jsx';
import {
  getWeatherByCity,
  getWeatherByCoords,
  getWeatherGradient,
  processHourly,
  processWeekly,
} from './services/weatherApi.js';

function App() {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [airPollution, setAirPollution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentCities, setRecentCities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wx-recent') || '[]');
    } catch {
      return [];
    }
  });
  const bgRef = useRef(null);

  function applyBackground(weatherId, isDay) {
    const [c1, c2, c3] = getWeatherGradient(weatherId, isDay);
    if (bgRef.current) {
      bgRef.current.style.background = `linear-gradient(160deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
    }
  }

  function applyResults(current, forecast, ap) {
    const isDay =
      typeof current.isDay === 'boolean'
        ? current.isDay
        : Date.now() / 1000 > current.sys.sunrise && Date.now() / 1000 < current.sys.sunset;
    setWeather(current);
    setHourly(processHourly(forecast));
    setWeekly(processWeekly(forecast));
    setAirPollution(ap);
    applyBackground(current.weather[0].id, isDay);
  }

  function addRecent(city) {
    const normalized = city.trim();
    const updated = [
      normalized,
      ...recentCities.filter((c) => c.toLowerCase() !== normalized.toLowerCase()),
    ].slice(0, 6);
    setRecentCities(updated);
    localStorage.setItem('wx-recent', JSON.stringify(updated));
  }

  async function handleSearch(city) {
    try {
      setLoading(true);
      setError('');
      const { current, forecast, airPollution: ap } = await getWeatherByCity(city);
      applyResults(current, forecast, ap);
      addRecent(city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchCoords(lat, lon, displayName) {
    try {
      setLoading(true);
      setError('');
      const { current, forecast, airPollution: ap } = await getWeatherByCoords(lat, lon, displayName);
      applyResults(current, forecast, ap);
      addRecent(displayName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeolocate() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { current, forecast, airPollution: ap } = await getWeatherByCoords(
            coords.latitude,
            coords.longitude
          );
          applyResults(current, forecast, ap);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }

  useEffect(() => {
    applyBackground(0, true);
  }, []);

  const isDay = weather ? (weather.isDay ?? true) : true;

  return (
    <div className="app-bg" ref={bgRef}>
      <div className="app-shell">
        <SearchBar
          onSearch={handleSearch}
          onSearchCoords={handleSearchCoords}
          onGeolocate={handleGeolocate}
          isLoading={loading}
          recentCities={recentCities}
        />

        {error && <p className="error-banner">{error}</p>}

        {loading && (
          <div className="loading-state">
            <div className="pulse-dots">
              <span /><span /><span />
            </div>
            <span>Fetching weather data…</span>
          </div>
        )}

        {!loading && !weather && !error && (
          <div className="empty-state">
            <div className="empty-icon">☁</div>
            <p>Search a city to see live weather</p>
            <p className="empty-hint">Try London, Tokyo, New York, or Mumbai</p>
          </div>
        )}

        {!loading && weather && (
          <div className="content-grid">
            <CurrentWeather weather={weather} isDay={isDay} today={weekly[0]} />
            <HourlyForecast hourly={hourly} />
            <WeeklyForecast weekly={weekly} />
            <WeatherDetails weather={weather} />
            <SunriseSunset
              sunrise={weather.sys.sunrise}
              sunset={weather.sys.sunset}
            />
            {airPollution && <AirQuality airPollution={airPollution} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
