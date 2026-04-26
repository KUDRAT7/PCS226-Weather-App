function getTempColor(temp) {
  if (temp <= 0) return '#93c5fd';
  if (temp <= 10) return '#67e8f9';
  if (temp <= 20) return '#6ee7b7';
  if (temp <= 30) return '#fcd34d';
  return '#fb923c';
}

function CurrentWeather({ weather, isDay, today }) {
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const condition = weather.weather[0].description;
  const icon = weather.weather[0].icon;
  // Use forecast-derived daily H/L (more accurate than current-weather temp_min/temp_max)
  const maxTemp = today?.maxTemp ?? Math.round(weather.main.temp_max);
  const minTemp = today?.minTemp ?? Math.round(weather.main.temp_min);
  const tempColor = getTempColor(temp);
  const locationLabel = [weather.name, weather.sys.country].filter(Boolean).join(', ');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card current-card">
      <div className="current-left">
        <div className="current-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
          </svg>
          <span>{locationLabel}</span>
        </div>
        <div className="current-datetime">{dateStr} · {timeStr}</div>
        <div className="current-temp" style={{ color: tempColor }}>
          {temp}<span className="deg">°</span>
        </div>
        <div className="current-condition">
          {condition}
        </div>
        <div className="current-meta">
          <span>Feels like <strong>{feelsLike}°</strong></span>
          <span className="meta-sep" />
          <span>H:<strong>{maxTemp}°</strong> L:<strong>{minTemp}°</strong></span>
        </div>
      </div>
      <div className="current-right">
        <div className="current-icon" aria-label={condition} role="img">{icon}</div>
        <div className="current-badge">{isDay ? 'Day' : 'Night'}</div>
      </div>
    </div>
  );
}

export default CurrentWeather;
