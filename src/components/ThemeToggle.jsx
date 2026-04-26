function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button className="theme-toggle" type="button" onClick={onToggle}>
      <span>{isDark ? 'Light' : 'Dark'} mode</span>
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  );
}

export default ThemeToggle;
