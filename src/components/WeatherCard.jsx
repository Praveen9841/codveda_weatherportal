import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Wind, 
  Droplets, 
  Thermometer, 
  Gauge 
} from 'lucide-react';

/**
 * WeatherCard displays detailed weather statistics for the searched city.
 * 
 * Props:
 * - data: OpenWeather weather object
 * - unit: string ("C" or "F") for temperature scale
 * - onUnitToggle: function to switch between C and F
 */
export default function WeatherCard({ data, unit, onUnitToggle }) {
  if (!data) return null;

  const { name, sys, main, weather, wind } = data;
  const tempK = main.temp;
  const feelsLikeK = main.feels_like;
  const humidity = main.humidity;
  const pressure = main.pressure;
  const windSpeed = wind.speed; // default is m/s
  const condition = weather[0]?.main || 'Default';
  const description = weather[0]?.description || '';

  // Kelvin converters
  const getTemp = (kelvin) => {
    if (unit === 'C') {
      return Math.round(kelvin - 273.15);
    }
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);
  };

  // Weather icon mapping
  const getWeatherIcon = (cond) => {
    const iconProps = { className: "weather-icon-svg animate-pulse", size: 80 };
    switch (cond.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} color="#f59e0b" />;
      case 'clouds':
        return <Cloud {...iconProps} color="#94a3b8" />;
      case 'rain':
        return <CloudRain {...iconProps} color="#3b82f6" />;
      case 'drizzle':
        return <CloudDrizzle {...iconProps} color="#60a5fa" />;
      case 'snow':
        return <CloudSnow {...iconProps} color="#93c5fd" />;
      case 'thunderstorm':
        return <CloudLightning {...iconProps} color="#a855f7" />;
      default:
        return <Wind {...iconProps} color="#64748b" />;
    }
  };

  // Get current date string
  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="glass-panel weather-main animate-fade-in">
      {/* Header Info */}
      <div className="weather-header-row">
        <div className="location-info">
          <h2 className="city-name">
            {name}, {sys.country}
          </h2>
          <span className="date-text">{formatDate()}</span>
        </div>
        
        {/* Metric / Imperial toggler */}
        <div className="unit-toggle" role="group" aria-label="Temperature unit selection">
          <button 
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onUnitToggle('C')}
          >
            °C
          </button>
          <button 
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onUnitToggle('F')}
          >
            °F
          </button>
        </div>
      </div>

      {/* Hero Temperature Display */}
      <div className="weather-hero">
        <div className="weather-icon-container">
          {getWeatherIcon(condition)}
        </div>
        <div className="temperature-display">
          <span className="temp-num">
            {getTemp(tempK)}<span className="temp-degree">°</span>
          </span>
          <span className="weather-description">{description}</span>
        </div>
      </div>

      {/* Weather details metrics */}
      <div className="weather-details-grid">
        <div className="detail-item">
          <Thermometer className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">{getTemp(feelsLikeK)}°{unit}</span>
          </div>
        </div>

        <div className="detail-item">
          <Droplets className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <Wind className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">
              {unit === 'C' 
                ? `${Math.round(windSpeed * 3.6)} km/h` 
                : `${Math.round(windSpeed * 2.237)} mph`
              }
            </span>
          </div>
        </div>

        <div className="detail-item">
          <Gauge className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
