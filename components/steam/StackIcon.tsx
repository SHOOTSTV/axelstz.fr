// Brand-stack icons, rendered in their native marks but tuned for the dark Steam theme.
export function StackIcon({ name, size = 44 }: { name: string; size?: number }) {
  const wrap = (children: React.ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
  switch (name) {
    case "react":
      return wrap(
        <g>
          <circle cx="12" cy="12" r="2" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse cx="12" cy="12" rx="11" ry="4.2" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" />
          </g>
        </g>,
      );
    case "next":
      return wrap(
        <g>
          <circle cx="12" cy="12" r="11" fill="#0a0c0f" stroke="#e7edf2" strokeWidth="1" />
          <path
            d="M8 16.6V7.6M8 7.6l8 11M16 7.6v7.2"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>,
      );
    case "tailwind":
      return wrap(
        <g fill="#38bdf8">
          <path d="M8 8.4c.7-2.8 2.5-4.2 5.3-4.2 4.2 0 4.7 3 6.8 3.5 1.4.4 2.6-.1 3.7-1.5-.7 2.8-2.5 4.2-5.3 4.2-4.2 0-4.7-3-6.8-3.5-1.4-.4-2.6.1-3.7 1.5z" />
          <path d="M1.2 15.6c.7-2.8 2.5-4.2 5.3-4.2 4.2 0 4.7 3 6.8 3.5 1.4.4 2.6-.1 3.7-1.5-.7 2.8-2.5 4.2-5.3 4.2-4.2 0-4.7-3-6.8-3.5-1.4-.4-2.6.1-3.7 1.5z" />
        </g>,
      );
    case "supabase":
      return wrap(
        <g>
          <defs>
            <linearGradient id="sb-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3ecf8e" />
              <stop offset="1" stopColor="#2aa56e" />
            </linearGradient>
          </defs>
          <path
            d="M12.6 2.6 4.4 12.2c-.6.7-.1 1.8.8 1.8H11v7.2c0 1 1.3 1.4 1.9.6l8.2-9.6c.6-.7.1-1.8-.8-1.8H14V3.2c0-1-1.3-1.4-1.4-.6z"
            fill="url(#sb-g)"
          />
        </g>,
      );
    case "responsive":
      return wrap(
        <g stroke="#cdd6de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="1.6" y="4" width="13.5" height="9.5" rx="1.3" />
          <path d="M2.5 16.6h10.5" />
          <rect x="16.2" y="8.2" width="6.2" height="11.2" rx="1.4" fill="#0a0c0f" />
          <path d="M18.6 17.4h1.4" />
        </g>,
      );
    default:
      return null;
  }
}
