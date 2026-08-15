import { siteConfig } from "@/config/site";

/**
 * Booking integration boundary.
 *
 * The UI talks to this interface, never to a vendor. Today the only available
 * implementation is an external scheduling link (Calendly or similar) read from
 * an environment variable. A native Google Calendar implementation slots in by
 * adding a provider here — no page or component changes.
 *
 * There is deliberately no fake calendar: showing invented time slots that
 * nobody can actually book is worse than sending the user to a working link.
 */

export type BookingSlot = {
  startsAt: string;
  endsAt: string;
  advisorId?: string;
};

export type BookingRequest = {
  leadId?: string;
  startsAt: string;
  endsAt: string;
  type: "phone" | "video" | "physical";
  name: string;
  email: string;
  phone: string;
};

export type BookingProvider = {
  readonly id: string;
  /** True when the provider can actually take a booking right now. */
  isConfigured(): boolean;
  /** External URL to redirect/embed, when the provider is link-based. */
  getExternalUrl(): string | null;
  /** Slot listing — only implemented by providers with a real calendar API. */
  listSlots?(range: { from: string; to: string }): Promise<BookingSlot[]>;
  createBooking?(request: BookingRequest): Promise<{ externalId: string }>;
};

/** Link-based provider: whatever URL is configured, isolated behind the interface. */
const externalLinkProvider: BookingProvider = {
  id: "external-link",
  isConfigured: () => Boolean(siteConfig.booking.externalUrl),
  getExternalUrl: () => siteConfig.booking.externalUrl || null,
};

/**
 * Fallback when nothing is configured: booking requests are captured through
 * the normal lead funnel with "book a time" as the contact preference, and an
 * advisor arranges the time. That is a real, working path — not a dead end.
 */
const funnelFallbackProvider: BookingProvider = {
  id: "funnel-fallback",
  isConfigured: () => false,
  getExternalUrl: () => null,
};

export function getBookingProvider(): BookingProvider {
  return externalLinkProvider.isConfigured() ? externalLinkProvider : funnelFallbackProvider;
}

export const bookingIsSelfService = () => getBookingProvider().isConfigured();
