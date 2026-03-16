import logoWhite from '../../../assets/logo-white.png';
import logoBlack from '../../../assets/logo-black.png';
import { useTheme } from '../../../context/ThemeContext';

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <a
      href="/"
      className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
      aria-label="DashyBoard Home"
    >
      <img src={theme === 'dark' ? logoWhite : logoBlack} alt="" className="h-8 w-auto" />
      <span className="hidden sm:inline text-base font-bold text-foreground">DashyBoard</span>
    </a>
  );
};
