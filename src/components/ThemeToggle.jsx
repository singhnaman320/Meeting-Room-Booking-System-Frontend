import React from 'react';
import { Sun, Moon, Stars } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative">
      {/* Toggle Switch Container */}
      <button
        onClick={toggleTheme}
        className={`
          relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-30
          ${isDark 
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 focus:ring-purple-500 shadow-lg shadow-purple-500/25' 
            : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 focus:ring-yellow-500 shadow-lg shadow-yellow-500/25'
          }
        `}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Sliding Circle */}
        <div
          className={`
            relative w-6 h-6 rounded-full transition-all duration-500 ease-in-out transform
            ${isDark 
              ? 'translate-x-8 bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg' 
              : 'translate-x-0 bg-gradient-to-br from-white to-yellow-100 shadow-lg'
            }
          `}
        >
          {/* Icon Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-slate-700 transition-all duration-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-yellow-600 transition-all duration-300" />
            )}
          </div>
        </div>

        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          {/* Sun Icon (Left) */}
          <Sun 
            className={`
              w-3 h-3 transition-all duration-300
              ${!isDark ? 'text-white opacity-0' : 'text-yellow-300 opacity-70'}
            `} 
          />
          
          {/* Moon Icon (Right) */}
          <Moon 
            className={`
              w-3 h-3 transition-all duration-300
              ${isDark ? 'text-white opacity-0' : 'text-slate-600 opacity-70'}
            `} 
          />
        </div>

        {/* Animated Stars (Dark Mode) */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <Stars className="absolute top-1 left-2 w-1 h-1 text-white opacity-60 animate-pulse" />
            <Stars className="absolute bottom-1 right-3 w-1 h-1 text-white opacity-40 animate-pulse delay-300" />
            <Stars className="absolute top-2 right-1 w-0.5 h-0.5 text-white opacity-80 animate-pulse delay-700" />
          </div>
        )}

        {/* Light Rays (Light Mode) */}
        {!isDark && (
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        )}
      </button>

      {/* Glow Effect */}
      <div 
        className={`
          absolute inset-0 rounded-full blur-md transition-all duration-500 -z-10
          ${isDark 
            ? 'bg-gradient-to-r from-purple-400 to-blue-400 opacity-30' 
            : 'bg-gradient-to-r from-yellow-300 to-orange-300 opacity-40'
          }
        `} 
      />
    </div>
  );
};

export default ThemeToggle;
