import { getAQIInfo } from '../services/weatherApi.js';

const pollutantLabels = {
  co: 'CO',
  no: 'NO',
  no2: 'NO₂',
  o3: 'O₃',
  so2: 'SO₂',
  pm2_5: 'PM2.5',
  pm10: 'PM10',
  nh3: 'NH₃',
};

function AirQuality({ airPollution }) {
  const aqi = airPollution?.list?.[0]?.main?.aqi;
  const components = airPollution?.list?.[0]?.components || {};
  if (!aqi) return null;

  const { label, color, bg } = getAQIInfo(aqi);
  const fillPct = ((aqi - 1) / 4) * 100;

  return (
    <div className="card aqi-card">
      <h3 className="section-title">Air Quality</h3>

      <div className="aqi-main" style={{ background: bg }}>
        <div className="aqi-score" style={{ color }}>{aqi}</div>
        <div className="aqi-label" style={{ color }}>{label}</div>
      </div>

      <div className="aqi-bar-wrap">
        <div className="aqi-track">
          <div className="aqi-fill" style={{ width: `${fillPct}%`, background: color }} />
        </div>
        <div className="aqi-scale">
          {['Good','Fair','Moderate','Poor','Very Poor'].map((l, i) => (
            <span key={i} style={{ opacity: aqi === i + 1 ? 1 : 0.4 }}>{l}</span>
          ))}
        </div>
      </div>

      <div className="aqi-components">
        {Object.entries(pollutantLabels).map(([key, name]) =>
          components[key] != null ? (
            <div className="aqi-comp" key={key}>
              <span className="aqi-comp-name">{name}</span>
              <span className="aqi-comp-val">{components[key].toFixed(1)}</span>
              <span className="aqi-comp-unit">µg/m³</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default AirQuality;
