import React, { useState, useEffect } from 'react';
import { CloudSun, AlertCircle, HelpCircle } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import ApiKeyInput from './components/ApiKeyInput';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';

/**
 * Main App component. Handles state for theme, API key,
 * weather data, loading status, search queries, and errors.
 */
function App() {
  // 1. STATE INITIALIZATION
  // Load preferences from localStorage to preserve state between reloads
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skycast_theme') || 'light';
  });
  
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('skycast_api_key') || '0999ec4fe1033788483b05db55c7ec56';
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit

  // 2. SIDE EFFECTS (useEffect)
  // Effect to update the document theme attribute whenever theme state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skycast_theme', theme);
  }, [theme]);

  // Effect to load the last searched city on startup if API key is present
  useEffect(() => {
    if (apiKey) {
      const lastCity = localStorage.getItem('skycast_last_city');
      if (lastCity) {
        fetchWeather(lastCity);
      } else {
        // Fallback default city for first load
        fetchWeather('London');
      }
    } else {
      // If no API key, clear any previous weather data
      setWeatherData(null);
      setError(null);
    }
  }, [apiKey]);

  // 3. API INTEGRATION
  /**
   * Fetches weather data from the OpenWeather API for a given city
   * @param {string} city - The name of the city to search for
   */
  const fetchWeather = async (city) => {
    if (!apiKey) {
      setError('Please configure your OpenWeather API key first.');
      return;
    }

    setLoading(true);
    setError(null);

    // MOCK DATA Fallback for Demo Mode
    if (apiKey === 'demo') {
      try {
        // Simulate network loading delay (800ms) for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 800));
        const data = getMockWeatherData(city);
        setWeatherData(data);
        localStorage.setItem('skycast_last_city', city);
      } catch (err) {
        setError('Error generating demo weather data.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      // Fetch data using the standard Fetch API
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // Success
        setWeatherData(data);
        // Persist the last searched city
        localStorage.setItem('skycast_last_city', city);
      } else {
        // Handle API errors (e.g. 404 City Not Found, 401 Invalid API Key)
        if (response.status === 404) {
          setError(`City "${city}" not found. Please double-check the spelling.`);
        } else if (response.status === 401) {
          setError('Invalid API Key. Please click "API Key Configuration" and re-enter a valid key.');
        } else {
          setError(data.message || 'Failed to fetch weather data. Please try again.');
        }
        setWeatherData(null);
      }
    } catch (err) {
      // Handle network errors
      setError('Network connection error. Please check your internet connection.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // 4. ACTION HANDLERS
  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSaveApiKey = (newKey) => {
    localStorage.setItem('skycast_api_key', newKey);
    setApiKey(newKey);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('skycast_api_key');
    localStorage.removeItem('skycast_last_city');
    setApiKey('');
    setWeatherData(null);
  };

  // 5. DETERMINISTIC UI OVERLAYS
  // Extract weather class for background styling
  const getWeatherClass = () => {
    if (!weatherData) return 'weather-default';
    const condition = weatherData.weather[0]?.main || 'default';
    return `weather-${condition.toLowerCase()}`;
  };

  return (
    <div className={`app-container ${getWeatherClass()}`}>
      <div className="app-content">
        
        {/* Header Section */}
        <header className="app-header animate-fade-in">
          <div className="brand-title">
            <CloudSun className="brand-icon" size={32} />
            <span>SkyCast</span>
          </div>
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </header>

        {/* API Key configuration Panel */}
        <ApiKeyInput 
          apiKey={apiKey === 'demo' ? '' : apiKey} // Display empty if it's the demo key
          onSave={handleSaveApiKey} 
          onClear={handleClearApiKey} 
        />

        {/* Demo Mode Badge */}
        {apiKey === 'demo' && (
          <div 
            className="animate-fade-in" 
            style={{
              background: 'var(--accent-light)',
              color: 'var(--accent-color)',
              border: '1px solid var(--border-color)',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>✨ Running in Demo Mode (Mock Data)</span>
            <button 
              onClick={handleClearApiKey}
              className="apikey-btn"
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              Exit Demo
            </button>
          </div>
        )}

        {/* Core App Functionality */}
        {apiKey ? (
          <>
            {/* Search Input Widget */}
            <Search onSearch={fetchWeather} disabled={loading} />

            {/* Error messaging */}
            {error && (
              <div className="error-card animate-fade-in" role="alert" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <AlertCircle className="error-icon" />
                  <span>{error}</span>
                </div>
                {error.includes('Invalid API Key') && (
                  <button 
                    onClick={() => handleSaveApiKey('demo')} 
                    className="apikey-btn" 
                    style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.5rem 1rem', 
                      alignSelf: 'flex-start', 
                      marginTop: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid currentColor',
                      color: 'var(--error-color)'
                    }}
                  >
                    Try Demo Mode (Mock Weather)
                  </button>
                )}
              </div>
            )}

            {/* Weather content (Loading spinner OR main card) */}
            {loading ? (
              <Loader />
            ) : (
              weatherData && (
                <WeatherCard 
                  data={weatherData} 
                  unit={unit} 
                  onUnitToggle={setUnit} 
                />
              )
            )}
          </>
        ) : (
          /* Instructions for users when API Key is missing */
          <div className="glass-panel setup-guide animate-fade-in">
            <HelpCircle className="setup-icon animate-pulse" />
            <h3 className="setup-title">Setup Required</h3>
            <p className="setup-desc">
              Please click the **API Key Configuration** panel above to enter your free OpenWeather API key. 
              This will enable real-time weather querying for any city in the world.
            </p>
            <button 
              onClick={() => handleSaveApiKey('demo')} 
              className="apikey-btn" 
              style={{ marginTop: '0.5rem' }}
            >
              Skip Setup (Try Demo Mode)
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>
            SkyCast &copy; {new Date().getFullYear()} &bull; Built with React &amp; Vite
          </p>
        </footer>

      </div>
    </div>
  );
}

/**
 * Returns mock weather data for demo mode
 * @param {string} city - The city name to generate mock data for
 */
function getMockWeatherData(city) {
  const normalized = city.trim().toLowerCase();
  
  // Real stats mapping for popular search terms
  const database = {
    london: {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 288.15, feels_like: 287.35, humidity: 82, pressure: 1012 },
      weather: [{ main: 'Clouds', description: 'scattered clouds' }],
      wind: { speed: 4.1 }
    },
    tokyo: {
      name: 'Tokyo',
      sys: { country: 'JP' },
      main: { temp: 298.15, feels_like: 298.15, humidity: 55, pressure: 1016 },
      weather: [{ main: 'Clear', description: 'clear sky' }],
      wind: { speed: 2.1 }
    },
    'new york': {
      name: 'New York',
      sys: { country: 'US' },
      main: { temp: 290.15, feels_like: 289.45, humidity: 75, pressure: 1008 },
      weather: [{ main: 'Rain', description: 'moderate rain' }],
      wind: { speed: 6.2 }
    },
    paris: {
      name: 'Paris',
      sys: { country: 'FR' },
      main: { temp: 292.55, feels_like: 292.05, humidity: 62, pressure: 1014 },
      weather: [{ main: 'Clear', description: 'sunny and clear' }],
      wind: { speed: 3.6 }
    },
    sydney: {
      name: 'Sydney',
      sys: { country: 'AU' },
      main: { temp: 285.15, feels_like: 284.25, humidity: 68, pressure: 1022 },
      weather: [{ main: 'Clouds', description: 'partly cloudy' }],
      wind: { speed: 5.0 }
    },
    delhi: {
      name: 'Delhi',
      sys: { country: 'IN' },
      main: { temp: 308.15, feels_like: 312.15, humidity: 45, pressure: 1004 },
      weather: [{ main: 'Mist', description: 'misty morning haze' }],
      wind: { speed: 1.8 }
    },
    mumbai: {
      name: 'Mumbai',
      sys: { country: 'IN' },
      main: { temp: 301.15, feels_like: 305.15, humidity: 88, pressure: 1006 },
      weather: [{ main: 'Rain', description: 'heavy monsoonal shower' }],
      wind: { speed: 7.2 }
    }
  };

  if (database[normalized]) {
    return database[normalized];
  }

  // Generative default mock for arbitrary inputs
  // Generates randomized but consistent weather based on the city name characters
  const charCodeSum = Array.from(normalized).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const tempSeed = (charCodeSum % 25) + 10; // 10C to 35C
  const humiditySeed = (charCodeSum % 50) + 40; // 40% to 90%
  const windSeed = ((charCodeSum % 15) + 1).toFixed(1); // 1 to 16 m/s
  const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'];
  const condition = conditions[charCodeSum % conditions.length];
  
  let desc = 'clear sky';
  if (condition === 'Clouds') desc = 'broken clouds';
  if (condition === 'Rain') desc = 'light shower rain';
  if (condition === 'Snow') desc = 'flurries and light snow';
  if (condition === 'Thunderstorm') desc = 'stormy skies';

  return {
    name: city.trim().charAt(0).toUpperCase() + city.trim().slice(1),
    sys: { country: 'Global' },
    main: { 
      temp: tempSeed + 273.15, 
      feels_like: tempSeed - 1 + 273.15, 
      humidity: humiditySeed, 
      pressure: 1013 
    },
    weather: [{ main: condition, description: desc }],
    wind: { speed: parseFloat(windSeed) }
  };
}

export default App;
