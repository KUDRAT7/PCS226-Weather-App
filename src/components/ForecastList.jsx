function formatDay(dateText) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateText));
}

function ForecastList({ forecast }) {
  if (!forecast.length) {
    return null;
  }

  return (
    <section className="forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast__grid">
        {forecast.map((day) => {
          const condition = day.weather[0].description;
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

          return (
            <article className="forecast-card" key={day.dt}>
              <p>{formatDay(day.dt_txt)}</p>
              <img src={iconUrl} alt={condition} />
              <strong>{Math.round(day.main.temp)}°C</strong>
              <span>{condition}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ForecastList;
