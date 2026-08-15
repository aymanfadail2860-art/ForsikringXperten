# Integration layer

Every external system is reached through a module in this folder. UI components
and route handlers import these interfaces — never a vendor SDK directly. That
is what makes a provider swap a one-file change instead of a search-and-replace
across the app.

| Folder | Responsibility | Status |
| --- | --- | --- |
| `crm/` | Lead persistence, pipeline reads, dashboard counts | **Active** (Supabase) |
| `notifications/` | Outbox for email/SMS/internal messages | **Queue only** — nothing is sent until a provider is configured |
| `calendar/` | Booking provider interface | **Link-based** via `NEXT_PUBLIC_BOOKING_URL`; falls back to the lead funnel |
| `email/` | Transactional email delivery | Interface only |
| `sms/` | SMS delivery | Interface only |
| `ai/` | Lead summaries, call prep, follow-up drafts | Interface only |

## Why several of these are interfaces without an implementation

Sending real messages, or showing bookable time slots, from an unconfigured
integration is worse than not doing it at all — a customer who books a meeting
nobody receives is a lost customer. So the architecture, the UI and the data
model are complete, and only the transport is missing. Adding a provider means
implementing one interface and setting the environment variables listed in
`.env.example`.

## Automation path

The data model already supports the intended chain without further migrations:

```
lead created  → lead_events row
              → notifications rows (advisor + confirmation)
              → score + score_factors on the lead
              → appointment row when a meeting is agreed
              → follow-up via leads.next_follow_up_at
```

A future enrichment or AI step reads a lead, writes back to `leads` and appends
to `lead_events`. Nothing in the current schema blocks it.
