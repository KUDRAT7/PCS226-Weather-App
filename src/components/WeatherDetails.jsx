function getUVLabel(uvi) {
  if (uvi <= 2) return { label: 'Low', color: '#22c55e' };
  if (uvi <= 5) return { label: 'Moderate', color: '#eab308' };
  if (uvi <= 7) return { label: 'High', color: '#f97316' };
  if (uvi <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
}

function DetailCard({ icon, label, value, sub, color }) {
  return (
    <div className="detail-card">
      <div className="detail-icon" style={color ? { color } : undefined}>{icon}</div>
      <div className="detail-body">
        <span className="detail-label">{label}</span>
        <strong className="detail-value">{value}</strong>
        {sub && <span className="detail-sub">{sub}</span>}
      </div>
    </div>
  );
}

function WeatherDetails({ weather }) {
  const humidity = weather.main.humidity;
  const wind = Math.round(weather.wind.speed * 3.6);
  const windDir = weather.wind.deg;
  const pressure = weather.main.pressure;
  const visibility = weather.visibility ? Math.round(weather.visibility / 1000) : null;
  const dewPoint = Math.round(
    weather.main.temp - ((100 - humidity) / 5)
  );

  const compassPoints = ['N','NE','E','SE','S','SW','W','NW'];
  const compass = compassPoints[Math.round(windDir / 45) % 8];

  const uvIndex = weather.uvi ?? null;
  const uvInfo = uvIndex !== null ? getUVLabel(uvIndex) : null;

  return (
    <div className="card details-card">
      <h3 className="section-title">Details</h3>
      <div className="details-grid">
        <DetailCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a5 5 0 0 1 5 5c0 5-5 13-5 13S7 12 7 7a5 5 0 0 1 5-5z" />
              <circle cx="12" cy="7" r="2" fill="currentColor" />
            </svg>
          }
          label="Humidity"
          value={`${humidity}%`}
          sub={humidity > 70 ? 'Muggy' : humidity > 40 ? 'Comfortable' : 'Dry'}
          color="#60a5fa"
        />

        <DetailCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
          }
          label="Wind"
          value={`${wind} km/h`}
          sub={compass}
          color="#34d399"
        />

        <DetailCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              <circle cx="12" cy="12" r="5" />
            </svg>
          }
          label="Pressure"
          value={`${pressure} hPa`}
          sub={pressure > 1013 ? 'High' : pressure < 1000 ? 'Low' : 'Normal'}
          color="#f59e0b"
        />

        {visibility !== null && (
          <DetailCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            label="Visibility"
            value={`${visibility} km`}
            sub={visibility >= 10 ? 'Clear' : visibility >= 4 ? 'Moderate' : 'Poor'}
            color="#a78bfa"
          />
        )}

        <DetailCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
          }
          label="Dew Point"
          value={`${dewPoint}°C`}
          sub="Atmospheric moisture"
          color="#38bdf8"
        />

        {uvInfo && (
          <DetailCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            }
            label="UV Index"
            value={uvIndex}
            sub={uvInfo.label}
            color={uvInfo.color}
          />
        )}
      </div>
    </div>
  );
}

export default WeatherDetails;
