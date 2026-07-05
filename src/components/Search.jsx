import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

/**
 * Search component handles user inputs to query weather by city name.
 * 
 * Props:
 * - onSearch: function that triggers the API call with the city query
 * - disabled: boolean indicating if input should be disabled (e.g. while loading)
 */
export default function Search({ onSearch, disabled }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCity = city.trim();
    if (cleanCity) {
      onSearch(cleanCity);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form animate-fade-in">
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search city (e.g. London, Tokyo)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={disabled}
          aria-label="City search"
          required
        />
      </div>
      <button 
        type="submit" 
        className="search-button"
        disabled={disabled}
        aria-label="Search button"
      >
        Search
      </button>
    </form>
  );
}
