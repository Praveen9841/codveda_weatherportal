import React, { useState } from 'react';
import { Key, ChevronDown, ChevronUp, Trash2, Save } from 'lucide-react';

/**
 * ApiKeyInput component allows users to input and configure
 * their personal OpenWeather API key. Key is persisted in localStorage.
 * 
 * Props:
 * - apiKey: string (the saved key, if any)
 * - onSave: function called when a new key is saved
 * - onClear: function called when the key is deleted
 */
export default function ApiKeyInput({ apiKey, onSave, onClear }) {
  const [isOpen, setIsOpen] = useState(!apiKey); // open by default if key is not configured
  const [inputValue, setInputValue] = useState(apiKey || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSave(inputValue.trim());
      setIsOpen(false); // close panel after saving successfully
    }
  };

  const handleClear = () => {
    onClear();
    setInputValue('');
    setIsOpen(true); // open panel so they can enter a new one
  };

  return (
    <div className="glass-panel apikey-container animate-fade-in">
      <div 
        className="apikey-header" 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
      >
        <div className="apikey-title">
          <Key size={18} />
          <span>API Key Configuration</span>
          {apiKey ? (
            <span style={{ 
              fontSize: '0.7rem', 
              color: 'var(--accent-color)', 
              background: 'var(--accent-light)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 500
            }}>Configured</span>
          ) : (
            <span style={{ 
              fontSize: '0.7rem', 
              color: 'var(--error-color)', 
              background: 'var(--error-bg)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 500
            }}>Required</span>
          )}
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="apikey-body animate-fade-in">
          <p className="apikey-info-text">
            This app uses the OpenWeather Map API. Please enter your API key below. 
            It is stored locally on your device. Get a free key at{' '}
            <a 
              href="https://openweathermap.org/api" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              openweathermap.org
            </a>.
          </p>
          <div className="apikey-input-group">
            <input
              type="password"
              className="apikey-input"
              placeholder="Paste your OpenWeather API Key"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!!apiKey}
            />
            {apiKey ? (
              <button 
                type="button" 
                className="apikey-btn clear-btn"
                onClick={handleClear}
                title="Clear configured API Key"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="apikey-btn"
                title="Save API Key"
              >
                <Save size={16} />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
