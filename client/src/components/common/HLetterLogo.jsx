import { useTheme } from "../../context/ThemeContext.jsx";
export const HLetterIcon = ({ size = 38, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Vibrant Sunset & Neon Gradient */}
        <linearGradient id="hIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Secondary Flow/Pulse Gradient */}
        <linearGradient id="hIconPulse" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft Glow Filter */}
        <filter id="hIconGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background Rounded Card with Glow */}
      <rect x="4" y="4" width="92" height="92" rx="26" fill="url(#hIconGrad)" filter="url(#hIconGlow)" />
      <rect x="4" y="4" width="92" height="92" rx="26" fill="#0f172a" fillOpacity="0.12" />

      {/* Main 'H' Structure & Core Connectors */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Vertical Bar */}
        <path d="M 30 26 L 30 74" stroke="#ffffff" strokeWidth="8" />
        {/* Right Vertical Bar */}
        <path d="M 70 26 L 70 74" stroke="#ffffff" strokeWidth="8" />
        {/* Dynamic Center Crossbar */}
        <path d="M 30 50 L 70 50" stroke="url(#hIconPulse)" strokeWidth="7" />
      </g>

      {/* Accent Nodes */}
      <circle cx="30" cy="26" r="4.5" fill="#fbcfe8" />
      <circle cx="70" cy="26" r="4.5" fill="#fbcfe8" />
      <circle cx="50" cy="50" r="4.5" fill="#38bdf8" />
      <circle cx="30" cy="74" r="4.5" fill="#fbcfe8" />
      <circle cx="70" cy="74" r="4.5" fill="#fbcfe8" />
    </svg>
  );
};

export const HLetterLogo = ({
  iconSize = 42,
  showBadge = true,
  showTagline = false,
  className = '',
}) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <HLetterIcon size={iconSize} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-black tracking-tight ${isDark ? "text-zinc-200" : "text-slate-700"} dark:text-zinc-200 font-display`}>
            Hum<span className="text-rose-500 dark:text-rose-400">nex</span>
          </span>
          {/* {showBadge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              HRMS
            </span>
          )} */}
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Connect. Scale. Succeed.
          </span>
        )}
      </div>
    </div>
  );
};

export default HLetterLogo;
