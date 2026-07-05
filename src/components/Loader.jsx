import React from 'react';

/**
 * Loader component displays a spinning visual indicator
 * during weather data retrieval.
 */
export default function Loader() {
  return (
    <div className="glass-panel spinner-container animate-fade-in" role="status">
      <div className="spinner animate-spin"></div>
      <p className="spinner-text">Retrieving weather forecast...</p>
    </div>
  );
}
