import { useTheme } from '../../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer relative inline-flex items-center h-7 w-12 rounded-full bg-glass backdrop-blur-sm border border-white/10 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      {/* Slider knob */}
      <div
        className={`relative inline-flex items-center justify-center h-6 w-6 rounded-full bg-overlay border border-white/20 shadow-md transition-all duration-300 ${
          isDark ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
        }`}
        aria-hidden="true"
      >
        {isDark ? (
          <svg className="size-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className="size-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>
    </button>
  );
};
