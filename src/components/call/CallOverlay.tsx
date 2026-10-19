import { useEffect, useRef, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  User as UserIcon,
  Building2,
  MapPin,
  Mail,
  Info,
} from 'lucide-react';
import { useCall } from '@/context/CallContext';
import { useToast } from '@/components/ui/Toast';
import { formatClock } from '@/utils/format';
import { Modal } from '@/components/ui/Modal';

type CallState = 'connecting' | 'active' | 'ended';

export function CallOverlay() {
  const { target, endCall } = useCall();
  const { push } = useToast();
  const [state, setState] = useState<CallState>('connecting');
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when target changes
  useEffect(() => {
    if (!target) return;
    setState('connecting');
    setSeconds(0);
    setMuted(false);
    setMicGranted(null);
  }, [target]);

  // Request mic permission
  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setMicGranted(true);
        setState('active');
      })
      .catch(() => {
        if (cancelled) return;
        setMicGranted(false);
        // For demo mode, allow proceeding without mic
        if (target.mode === 'demo') {
          setState('active');
        }
      });
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [target]);

  // Timer
  useEffect(() => {
    if (state === 'active') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  if (!target) return null;
  const { lead, mode } = target;

  const toggleMute = () => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted((m) => !m);
  };

  const handleEnd = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setState('ended');
    push(
      mode === 'demo'
        ? 'Demo call ended. No real connection was made.'
        : `Call with ${lead.name} ended (${formatClock(seconds)}).`,
      mode === 'demo' ? 'info' : 'success'
    );
    setTimeout(() => endCall(), 600);
  };

  return (
    <Modal open={!!target} onClose={handleEnd} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className="grid place-items-center w-20 h-20 rounded-full bg-slate-900 text-white text-2xl font-semibold mb-3">
          {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
        <p className="text-sm text-slate-500">
          {lead.title} · {lead.company}
        </p>

        {mode === 'demo' && (
          <div className="mt-3 flex items-center gap-1.5 badge bg-amber-100 text-amber-700">
            <Info size={12} /> Demo call — simulated
          </div>
        )}

        <div className="mt-4 text-3xl font-mono font-semibold text-slate-800 tabular-nums">
          {state === 'connecting' ? 'Connecting…' : formatClock(seconds)}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {state === 'active' ? (
            <span className="flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          ) : state === 'ended' ? (
            'Call ended'
          ) : (
            'Requesting microphone access…'
          )}
        </div>

        {micGranted === false && mode !== 'demo' && (
          <p className="mt-3 text-xs text-rose-600 max-w-xs">
            Microphone access was blocked. Enable it in your browser to make live calls.
          </p>
        )}

        <div className="mt-5 w-full grid grid-cols-2 gap-2 text-left text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone size={13} className="text-slate-400" /> {lead.phone}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail size={13} className="text-slate-400" /> {lead.email}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 size={13} className="text-slate-400" /> {lead.company}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={13} className="text-slate-400" /> {lead.city}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={toggleMute}
            disabled={state !== 'active'}
            className={`grid place-items-center w-12 h-12 rounded-full transition-colors ${
              muted ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            } disabled:opacity-40`}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={handleEnd}
            className="grid place-items-center w-14 h-14 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors"
            aria-label="End call"
          >
            <PhoneOff size={22} />
          </button>
          <div className="grid place-items-center w-12 h-12 rounded-full bg-slate-100 text-slate-400">
            <UserIcon size={20} />
          </div>
        </div>

        <p className="mt-4 text-[11px] text-slate-400 max-w-xs">
          {mode === 'demo'
            ? 'Demo mode simulates the call interface. Connect a VoIP provider in Settings for real calls.'
            : 'Live audio uses your browser microphone. Connect a SIP/VoIP provider for outbound dialing.'}
        </p>
      </div>
    </Modal>
  );
}
