# OnGround.ai Call Centre

A fully functional, responsive call-centre web application built with React, Vite, TypeScript, React Router, Tailwind CSS, Lucide React, and Recharts.

## Features

### Implemented (mandatory)

- **Application shell** — reusable sidebar + top bar layout with navigation: Dashboard, Plan (Calls to Make, Incoming, Recent), Calendar, Pulse.
- **Dashboard** — KPI cards, calling progress, waiting leads, earnings breakdown, task list, and interactive 7-day performance charts (area + bar). Clicking a lead-type task opens the Leads modal.
- **Calls to Make** — leads ranked by score with contact details, lead value, status, expandable rows (contact info + buying signals), call/view actions, status filters, sortable columns, and working pagination.
- **Incoming Calls** — missed/waiting/queued calls with caller details, time, status, and value at stake. A working callback button on every row (triggers a demo call for known leads, schedules a callback otherwise).
- **Recent Calls** — table with type, contact, date, time, duration, and status. Clicking any row opens a review modal with outcome, notes, and a recording placeholder.
- **Calling interface** — modal overlay with contact information, live microphone permission request, call status, duration timer, mute/unmute, and end-call controls. Supports two modes:
  - **Live** — requests browser microphone access via `getUserMedia`.
  - **Demo** — clearly labelled "Demo call — simulated" and never pretends to be a real connection.
- **Calendar** — monthly grid with previous/next month controls, a Today button, event dots colour-coded by type (call, follow-up, meeting, demo), date selection, and a side panel listing the selected day's events.
- **Pulse Home** — AvaniBot hero, role/task agent cards (ASM Agent, Pitch Coach, Tele-caller, Walk-out Recovery, Follow-up), channels list with unread counts, and Kudos recognition cards.
- **Pulse Channel** — back button, channel header, chat bubbles with timestamps, a pinned "Needs Your Input" card with two+ working response buttons, and a reply box. Sent messages appear immediately and persist via LocalStorage.
- **Leads modal** — opens from the dashboard task list and the Calls to Make table. Shows lead details, ICP fit score, lead intent score, collapsible buying signals, previous/next navigation, current record position, and close control. Includes 12 sample leads.
- **Search & interactions** — global search in the top bar filters leads, calls, and companies. Filters, tabs, pagination, expandable rows, profile menu, and toast success/error messages are all functional. No decorative buttons.
- **Data** — typed TypeScript mock data for leads, calls, tasks, calendar events, Pulse channels, and messages. Pulse chat messages persist to LocalStorage.
- **Responsive design** — sidebar collapses to an overlay drawer on mobile, tables scroll horizontally and hide non-essential columns at smaller breakpoints, modals are viewport-friendly, and call controls remain accessible.
- **Code structure** — reusable UI components (Card, Modal, Badge, Toast), typed data models, separate pages, context providers, and mock-data files. No single huge component.

### Bonus features

- Channel messaging with LocalStorage persistence.
- Answering "Needs Your Input" cards with multiple response options.
- Practice / demo calls via the calling interface.
- Callbacks from the Incoming Calls page.
- Mobile support throughout.
- Interactive charts (Recharts).

## Calling feature — setup & limitations

The calling interface uses the browser's `navigator.mediaDevices.getUserMedia` API to request microphone access and display a live call UI with timer, mute, and end-call controls.

**What works out of the box:**
- Microphone permission flow.
- Live timer, mute/unmute, and end-call.
- Clear labelling of demo vs live modes.

**What requires external configuration:**
- Real outbound dialing to a phone number requires connecting a VoIP/SIP provider (e.g. Twilio, Vonage, RingCentral, or a WebRTC-compatible PBX). This app does not include a telephony backend — no provider credentials are bundled.
- To enable real calls, integrate a provider SDK in `CallOverlay.tsx` and add the provider's credentials via environment variables. The current implementation simulates the audio path and is clearly labelled "Demo call — simulated" when in demo mode.

**Limitations:**
- No actual PSTN connection is made. Demo calls never pretend to be real.
- Microphone access requires a secure context (HTTPS or localhost).
- Call recordings referenced in the Recent Calls review modal are placeholders.

## Technology choices

- **React 18** + **TypeScript** — UI and type safety.
- **Vite 5** — build tooling and dev server.
- **React Router v7** — client-side routing.
- **Tailwind CSS 3** — styling and responsive design.
- **Lucide React** — icons.
- **Recharts** — charts.
- **LocalStorage** — demo persistence for Pulse chat messages.

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Type-check
npm run typecheck

# Lint
npm run lint
```

The app runs entirely in the browser with no backend required.

## Testing instructions

1. Run `npm run dev` and open the local URL.
2. **Dashboard** — verify KPI cards, progress bar, charts render. Click a task with a lead count to open the Leads modal.
3. **Calls to Make** — filter by status, sort columns, expand a row, use pagination, click Call to open the calling interface (demo), click the eye icon to open the Leads modal.
4. **Incoming Calls** — filter by Missed/Waiting/Queued, click Callback on a row (known lead triggers a demo call).
5. **Recent Calls** — filter by type, click a row to open the review modal.
6. **Calling interface** — grant microphone permission; verify timer counts, mute toggles, end call works and shows a toast. Demo mode is clearly labelled.
7. **Calendar** — navigate months, click Today, select a date with event dots, view events in the side panel.
8. **Pulse Home** — open AvaniBot chat, browse agent cards, open a channel.
9. **Pulse Channel** — send a message, respond to the pinned "Needs Your Input" card with a button, refresh the page to confirm messages persist.
10. **Leads modal** — navigate prev/next, expand buying signals, check record position counter, close.
11. **Search** — type in the top bar search and verify leads/calls filter on Calls to Make, Incoming, and Recent pages.
12. **Responsive** — resize to tablet and mobile widths; verify the sidebar becomes a drawer and tables remain usable.

## AI tools used

- **Bolt** (bolt.new) — primary development environment.
- **Claude** — code generation and assistance.

## Project structure

```
src/
  components/
    call/         # Call overlay
    layout/       # App shell, sidebar, top bar
    leads/        # Leads modal
    ui/           # Reusable Card, Modal, Badge, Toast
  context/        # Call, LeadsModal, Search contexts
  data/           # Mock data (leads, calls, dashboard, calendar, pulse)
  pages/          # Dashboard, Calls, Incoming, Recent, Calendar, Pulse
  types/          # TypeScript data models
  utils/          # Formatting helpers
```
