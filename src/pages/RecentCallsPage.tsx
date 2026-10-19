import { useMemo, useState } from 'react';
import {
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  PhoneForwarded,
  Mic,
  Clock,
  ChevronRight,
  PlayCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, statusTone } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useSearch } from '@/context/SearchContext';
import { recentCalls, callsById } from '@/data/calls';
import { formatDuration, formatDate } from '@/utils/format';
import type { CallRecord, CallType } from '@/types';

const typeIcon: Record<CallType, typeof PhoneOutgoing> = {
  Outbound: PhoneOutgoing,
  Inbound: PhoneIncoming,
  Missed: PhoneMissed,
  Callback: PhoneForwarded,
  Practice: Mic,
};

type Filter = 'All' | 'Outbound' | 'Inbound' | 'Callback' | 'Missed';

export function RecentCallsPage() {
  const { query } = useSearch();
  const [filter, setFilter] = useState<Filter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = recentCalls;
    if (filter !== 'All') list = list.filter((c) => c.type === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.contactName.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, query]);

  const selected = selectedId ? callsById[selectedId] : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Recent Calls</h1>
        <p className="text-sm text-slate-500 mt-0.5">Click any call to review the details</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(['All', 'Outbound', 'Inbound', 'Callback', 'Missed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`badge cursor-pointer transition-colors ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs text-slate-500">
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Time</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c: CallRecord) => {
                const Icon = typeIcon[c.type];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="hover:bg-slate-50/60 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className="text-slate-400" />
                        <span className="text-slate-700">{c.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{c.contactName}</div>
                      <div className="text-xs text-slate-500">{c.company}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{formatDate(c.date)}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{c.time}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-600">{formatDuration(c.durationSeconds)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <ChevronRight size={15} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No calls match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title="Call Review"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setSelectedId(null)} className="btn-secondary">Close</button>
            <button
              onClick={() => {
                setSelectedId(null);
              }}
              className="btn-primary"
            >
              <PlayCircle size={15} /> Play recording
            </button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-slate-900 text-white text-sm font-semibold">
                {selected.contactName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{selected.contactName}</div>
                <div className="text-sm text-slate-500">{selected.company}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Field label="Type" value={selected.type} />
              <Field label="Status" value={selected.status} />
              <Field label="Date" value={`${formatDate(selected.date)} · ${selected.time}`} />
              <Field label="Duration" value={formatDuration(selected.durationSeconds)} />
              <Field label="Phone" value={selected.phone} />
              <Field label="Value" value={selected.value ? `$${selected.value.toLocaleString()}` : '—'} />
            </div>

            {selected.outcome && (
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500 mb-1">Outcome</div>
                <p className="text-sm text-slate-700">{selected.outcome}</p>
              </div>
            )}

            {selected.notes && (
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500 mb-1">Notes</div>
                <p className="text-sm text-slate-700">{selected.notes}</p>
              </div>
            )}

            <div className="rounded-lg border border-slate-200 p-4 flex items-center gap-3">
              <PlayCircle size={20} className="text-slate-400" />
              <div className="flex-1">
                <div className="text-sm text-slate-700">Call recording</div>
                <div className="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
                  <div className="h-full w-1/3 bg-slate-300" />
                </div>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {formatDuration(selected.durationSeconds)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-slate-800 mt-0.5">{value}</div>
    </div>
  );
}
