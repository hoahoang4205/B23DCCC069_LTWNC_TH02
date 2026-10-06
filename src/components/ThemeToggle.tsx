import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === 'light' ? 'Chuyển sang tối' : 'Chuyển sang sáng'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}