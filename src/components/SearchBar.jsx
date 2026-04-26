import { useEffect, useRef, useState } from 'react';
import { getCitySuggestions } from '../services/weatherApi.js';

function SearchBar({ onSearch, onSearchCoords, onGeolocate, isLoading, recentCities }) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  function submit(city) {
    const trimmed = city || value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setValue('');
    setOpen(false);
    setSuggestions([]);
  }

  function selectSuggestion(item) {
    const cleanName = item.ascii_name || item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const label = [cleanName, item.state, item.country].filter(Boolean).join(', ');
    onSearchCoords(item.lat, item.lon, label);
    setValue('');
    setOpen(false);
    setSuggestions([]);
  }

  function handleChange(e) {
    const q = e.target.value;
    setValue(q);
    setOpen(true);

    clearTimeout(debounceRef.current);
    if (q.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        const results = await getCitySuggestions(q.trim());
        setSuggestions(results);
      }, 300);
    } else {
      setSuggestions([]);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') setOpen(false);
  }

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const filteredRecent = recentCities.filter(
    (c) => !value || c.toLowerCase().includes(value.toLowerCase())
  );

  const showSuggestions = open && suggestions.length > 0;
  const showRecent = open && suggestions.length === 0 && filteredRecent.length > 0;

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className="search-bar">
        <button
          className="geo-btn"
          type="button"
          onClick={onGeolocate}
          disabled={isLoading}
          aria-label="Use my location"
          title="Use my location"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        <input
          type="text"
          value={value}
          placeholder="Search city…"
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          disabled={isLoading}
          aria-label="City search"
          aria-autocomplete="list"
          aria-expanded={showSuggestions || showRecent}
        />

        <button
          className="search-btn"
          type="button"
          onClick={() => submit()}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spin-sm" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </button>
      </div>

      {showSuggestions && (
        <ul className="dropdown" role="listbox">
          {suggestions.map((item, i) => (
            <li
              key={`${item.lat}-${item.lon}-${i}`}
              role="option"
              className="dropdown-item"
              onMouseDown={() => selectSuggestion(item)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </svg>
              <span className="suggestion-name">
  {item.ascii_name || item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
</span>
              <span className="suggestion-meta">
                {[item.state, item.country].filter(Boolean).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showRecent && (
        <ul className="dropdown" role="listbox">
          {filteredRecent.map((city) => (
            <li
              key={city}
              role="option"
              className="dropdown-item"
              onMouseDown={() => submit(city)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
