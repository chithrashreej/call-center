import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Phone,
  RefreshCw,
  Users,
  MonitorPlay,
} from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { calendarEvents } from '@/data/calendar';
import type { CalendarEvent, CalendarEventType } from '@/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const eventIcon: Record<CalendarEventType, typeof Phone> = {
  call: Phone,
  'follow-up': RefreshCw,
  meeting: Users,
  demo: MonitorPlay,
};

const eventTone: Record<CalendarEventType, string> = {
  call: 'bg-sky-500',
  'follow-up': 'bg-amber-500',
  meeting: 'bg-emerald-500',
  demo: 'bg-violet-500',
};

function toISO(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
    .getDate()
    .toString()
    .padStart(2, '0')}`;
}

export function CalendarPage() {
  const today = new Date(2026, 9, 19); // anchor "today" to match mock data
  const [view, setView] = useState(new Date(2026, 9, 1));
  const [selected, setSelected] = useState<string>(toISO(today));

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of calendarEvents) {
      (map[e.date] ||= []).push(e);
    }
    return map;
  }, []);

  const cells: { date: Date; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), current: false });
    if (cells.length >= 42) break;
  }

  const selectedEvents = eventsByDate[selected] || [];

  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));
  const goToday = () => {
    setView(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(toISO(today));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Scheduled calls, follow-ups and meetings</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="btn-secondary">Today</button>
          <button onClick={prevMonth} className="btn-secondary p-2" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="btn-secondary p-2" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <Card pad={false} className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900">
                {MONTHS[month]} {year}
              </h3>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-medium text-slate-400 py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, i) => {
                const iso = toISO(cell.date);
                const events = eventsByDate[iso] || [];
                const isToday = iso === toISO(today);
                const isSelected = iso === selected;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(iso)}
                    className={`aspect-square rounded-lg p-1 sm:p-1.5 text-left flex flex-col transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : isToday
                        ? 'bg-slate-100 text-slate-900'
                        : cell.current
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className={`text-xs ${isToday && !isSelected ? 'font-bold' : ''}`}>
                      {cell.date.getDate()}
                    </span>
                    {events.length > 0 && (
                      <div className="mt-auto flex gap-0.5 flex-wrap">
                        {events.slice(0, 3).map((e) => (
                          <span
                            key={e.id}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : eventTone[e.type]}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <Legend color="bg-sky-500" label="Call" />
              <Legend color="bg-amber-500" label="Follow-up" />
              <Legend color="bg-emerald-500" label="Meeting" />
              <Legend color="bg-violet-500" label="Demo" />
            </div>
          </div>
        </Card>

        {/* Selected day events */}
        <Card>
          <SectionTitle
            title={new Date(selected + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
            subtitle={`${selectedEvents.length} event${selectedEvents.length === 1 ? '' : 's'}`}
          />
          <div className="space-y-2.5">
            {selectedEvents.map((e) => {
              const Icon = eventIcon[e.type];
              return (
                <div key={e.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className={`grid place-items-center w-9 h-9 rounded-lg ${eventTone[e.type]} text-white shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800">{e.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {e.time} · {e.durationMinutes}min · with {e.withName}
                      </div>
                      <div className="mt-1.5">
                        <Badge tone="neutral">{e.type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {selectedEvents.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-400">
                No events scheduled for this day.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
    </div>
  );
}
