import { useState } from 'react';

function Search({ onSearch, isLoading }) {
  const [city, setCity] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!city.trim()) {
      return;
    }

    onSearch(city.trim());
    setCity('');
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Search city..."
        aria-label="City name"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default Search;
