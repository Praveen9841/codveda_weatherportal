import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle component renders a button to switch between
 * light and dark modes.
 * 
 * Props:
 * - theme: string ("light" or "dark")
 * - onToggle: function to switch the theme
 */
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle-btn"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="animate-pulse" />
      ) : (
        <Sun className="animate-pulse" />
      )}
    </button>
  );
}
