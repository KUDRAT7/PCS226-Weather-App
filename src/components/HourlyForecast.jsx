import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{d.label}</strong>
      <span>{d.temp}°C</span>
      {d.pop > 0 && <span className="chart-rain">{d.pop}% rain</span>}
    </div>
  );
}

function HourlyForecast({ hourly }) {
  if (!hourly.length) return null;

  const temps = hourly.map((h) => h.temp);
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;

  return (
    <div className="card hourly-card">
      <h3 className="section-title">Hourly</h3>

      <div className="hourly-strip">
        {hourly.map((h, i) => (
          <div className="hourly-item" key={h.dt}>
            <span className="hourly-time">{i === 0 ? 'Now' : h.label}</span>
            <div className="hourly-icon" aria-label={h.condition} role="img">{h.icon}</div>
            <span className="hourly-temp">{h.temp}°</span>
            {h.pop > 0 && (
              <span className="hourly-pop">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 4 8 4 12a8 8 0 0 0 16 0c0-4-2.5-10-8-10z" />
                </svg>
                {h.pop}%
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="hourly-chart">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minT, maxT]}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              strokeWidth={2.5}
              fill="url(#tempGrad)"
              dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#fff', stroke: '#60a5fa', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HourlyForecast;
