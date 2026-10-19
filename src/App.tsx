import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/Toast';
import { CallProvider } from '@/context/CallContext';
import { LeadsModalProvider } from '@/context/LeadsModalContext';
import { SearchProvider } from '@/context/SearchContext';
import { DashboardPage } from '@/pages/DashboardPage';
import { CallsToMakePage } from '@/pages/CallsToMakePage';
import { IncomingCallsPage } from '@/pages/IncomingCallsPage';
import { RecentCallsPage } from '@/pages/RecentCallsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { PulseHomePage } from '@/pages/PulseHomePage';
import { PulseChannelPage } from '@/pages/PulseChannelPage';

function App() {
  const [search, setSearch] = useState('');
  return (
    <BrowserRouter>
      <ToastProvider>
        <CallProvider>
          <LeadsModalProvider>
            <SearchProvider query={search}>
              <AppShell search={search} onSearchChange={setSearch}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/plan/calls" element={<CallsToMakePage />} />
                  <Route path="/plan/incoming" element={<IncomingCallsPage />} />
                  <Route path="/plan/recent" element={<RecentCallsPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/pulse" element={<PulseHomePage />} />
                  <Route path="/pulse/:channelId" element={<PulseChannelPage />} />
                  <Route path="*" element={<DashboardPage />} />
                </Routes>
              </AppShell>
            </SearchProvider>
          </LeadsModalProvider>
        </CallProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
