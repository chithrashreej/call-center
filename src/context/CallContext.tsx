import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Lead } from '@/types';

interface CallTarget {
  lead: Lead;
  mode: 'live' | 'demo';
}

interface CallContextValue {
  target: CallTarget | null;
  startCall: (lead: Lead, mode?: 'live' | 'demo') => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextValue | null>(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within CallProvider');
  return ctx;
}

export function CallProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<CallTarget | null>(null);

  const startCall = useCallback((lead: Lead, mode: 'live' | 'demo' = 'live') => {
    setTarget({ lead, mode });
  }, []);

  const endCall = useCallback(() => setTarget(null), []);

  const value = useMemo(() => ({ target, startCall, endCall }), [target, startCall, endCall]);

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
