function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const condition = weather.weather[0].description;

  return (
    <section className="weather-card">
      <div>
        <p className="eyebrow">Current Weather</p>
        <h2>
          {weather.name}, {weather.sys.country}
        </h2>
        <p className="condition">{condition}</p>
      </div>

      <div className="weather-card__main">
        <img src={iconUrl} alt={condition} />
        <p className="temperature">{temperature}°C</p>
      </div>

      <div className="weather-card__details">
        <div>
          <span>Feels like</span>
          <strong>{feelsLike}°C</strong>
        </div>
        <div>
          <span>Humidity</span>
          <strong>{weather.main.humidity}%</strong>
        </div>
        <div>
          <span>Wind</span>
          <strong>{Math.round(weather.wind.speed)} m/s</strong>
        </div>
      </div>
    </section>
  );
}

export default WeatherCard;
