import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export function Topbar({ onMenuClick, search, onSearchChange }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white/90 backdrop-blur flex items-center gap-3 px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-600 hover:text-slate-900"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads, calls, companies..."
          className="input pl-9"
          aria-label="Search"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1.5 pr-2 hover:bg-slate-100"
            aria-label="Profile menu"
          >
            <div className="grid place-items-center w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-semibold">
              AV
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-semibold text-slate-800">Ava Rep</div>
              <div className="text-[11px] text-slate-500">Senior AE</div>
            </div>
            <ChevronDown size={15} className="text-slate-400 hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 card p-1.5 shadow-lg animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="text-sm font-semibold text-slate-800">Ava Rep</div>
                <div className="text-xs text-slate-500">ava@onground.ai</div>
              </div>
              <button className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <User size={15} /> Profile
              </button>
              <button className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Settings size={15} /> Settings
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
