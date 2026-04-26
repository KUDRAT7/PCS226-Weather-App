function fmtDay(dt, i) {
  if (i === 0) return 'Today';
  return new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date(dt));
}

function RainBar({ pop }) {
  const segments = 10;
  const filled = Math.round((pop / 100) * segments);
  return (
    <div className="rain-bar" title={`${pop}% precipitation`}>
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className={`rain-seg${i < filled ? ' filled' : ''}`}
        />
      ))}
      <span className="rain-pct">{pop}%</span>
    </div>
  );
}

function WeeklyForecast({ weekly }) {
  if (!weekly.length) return null;

  const allMax = weekly.map((d) => d.maxTemp);
  const allMin = weekly.map((d) => d.minTemp);
  const rangeMax = Math.max(...allMax);
  const rangeMin = Math.min(...allMin);
  const range = rangeMax - rangeMin || 1;

  return (
    <div className="card weekly-card">
      <h3 className="section-title">{weekly.length}-Day Forecast</h3>
      <div className="weekly-list">
        {weekly.map((day, i) => {
          const barLeft = ((day.minTemp - rangeMin) / range) * 100;
          const barWidth = ((day.maxTemp - day.minTemp) / range) * 100;

          return (
            <div className="weekly-row" key={day.dt}>
              <span className="weekly-day">{fmtDay(day.dt, i)}</span>

              <div className="weekly-icon" aria-label={day.condition} role="img">{day.icon}</div>

              <div className="weekly-temps">
                <span className="temp-night">{day.nightTemp}°</span>
                <div className="temp-range-track">
                  <div
                    className="temp-range-fill"
                    style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 6)}%` }}
                  />
                </div>
                <span className="temp-day">{day.dayTemp}°</span>
              </div>

              <RainBar pop={day.pop} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyForecast;
