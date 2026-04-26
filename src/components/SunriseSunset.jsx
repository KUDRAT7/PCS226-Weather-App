function fmt(unix) {
  return new Date(unix * 1000).toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SunriseSunset({ sunrise, sunset }) {
  const now = Date.now() / 1000;
  const total = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(now - sunrise, total));
  const progress = total > 0 ? elapsed / total : 0;
  const isActive = now >= sunrise && now <= sunset;

  // Arc: half-circle above the horizon
  // Center (cx, cy), radius r
  // Left endpoint = sunrise (70, 120), right = sunset (250, 120)
  const cx = 160, cy = 120, r = 90;
  const sx = cx - r;  // 70
  const sy = cy;      // 120
  const ex = cx + r;  // 250
  const ey = cy;      // 120

  // Background arc (left to right, above horizon = sweep=0 in SVG)
  const dArc = `M ${sx} ${sy} A ${r} ${r} 0 0 0 ${ex} ${ey}`;

  // Sun position: angle goes from π (left) toward 0/2π (right), passing through π/2 (top)
  // arcAngle = π * (1 - progress) gives: progress=0 → π (left), progress=1 → 0 (right)
  const arcAngle = Math.PI * (1 - progress);
  const sunX = cx + r * Math.cos(arcAngle);
  const sunY = cy - r * Math.sin(arcAngle); // sin>0 in [0,π] so sunY < cy = above horizon

  // Progress arc from sunrise to sun position
  const largeArc = progress > 0.5 ? 1 : 0;
  const dProgress = `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 0 ${sunX.toFixed(2)} ${sunY.toFixed(2)}`;

  const dayMins = Math.round(total / 60);
  const hours = Math.floor(dayMins / 60);
  const mins = dayMins % 60;

  return (
    <div className="card sun-card">
      <h3 className="section-title">Sunrise & Sunset</h3>
      <div className="sun-content">
        <svg viewBox="0 0 320 140" className="sun-arc" aria-hidden="true">
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Horizon line */}
          <line x1="55" y1={cy} x2="265" y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Background arc */}
          <path d={dArc} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" />

          {/* Progress arc */}
          {isActive && progress > 0.01 && (
            <path d={dProgress} fill="none" stroke="url(#progressGrad)" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Sun glow + dot */}
          {isActive && (
            <>
              <circle cx={sunX} cy={sunY} r="12" fill="#fbbf24" opacity="0.2" />
              <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" />
            </>
          )}

          {/* Endpoint dots */}
          <circle cx={sx} cy={sy} r="4" fill="#f97316" />
          <circle cx={ex} cy={ey} r="4" fill="#9333ea" />
        </svg>

        <div className="sun-labels">
          <div className="sun-time">
            <span className="sun-icon">🌅</span>
            <span className="sun-val">{fmt(sunrise)}</span>
            <span className="sun-name">Sunrise</span>
          </div>
          <div className="sun-center">
            <span className="sun-daylength">{hours}h {mins}m</span>
            <span className="sun-daylabel">daylight</span>
          </div>
          <div className="sun-time">
            <span className="sun-icon">🌇</span>
            <span className="sun-val">{fmt(sunset)}</span>
            <span className="sun-name">Sunset</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SunriseSunset;
