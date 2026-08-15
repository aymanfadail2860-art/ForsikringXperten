/**
 * Database types.
 *
 * Hand-maintained to match `supabase/migrations`. Regenerate with
 * `npx supabase gen types typescript --project-id <id>` once the project is
 * linked; until then this file is the contract, and it is kept narrow on
 * purpose — only what the application actually reads or writes.
 */

export type LeadTypeDb = "privat" | "erhverv";

export type LeadStatusDb =
  | "new"
  | "attempted_contact"
  | "contacted"
  | "qualified"
  | "meeting_booked"
  | "proposal"
  | "won"
  | "lost"
  | "follow_up";

export type LeadTemperatureDb = "low" | "medium" | "high";
export type ContactMethodDb = "ring" | "book" | "email";
export type AppointmentTypeDb = "phone" | "video" | "physical";
export type AppointmentStatusDb = "scheduled" | "completed" | "cancelled" | "no_show";
export type AdminRoleDb = "admin" | "advisor" | "viewer";

export type LeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_type: LeadTypeDb;
  status: LeadStatusDb;
  status_changed_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company_id: string | null;
  industry: string | null;
  employees_range: string | null;
  current_provider: string | null;
  selected_products: string[];
  primary_goal: string | null;
  preferred_contact_method: ContactMethodDb | null;
  comment: string | null;
  score: number;
  temperature: LeadTemperatureDb;
  score_factors: { key: string; label: string; points: number }[];
  scoring_version: number;
  assigned_to: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  contact_attempts: number;
  source: string | null;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  consent_id: string | null;
  session_id: string | null;
};

export type LeadInsert = Omit<
  LeadRow,
  "id" | "created_at" | "updated_at" | "status_changed_at"
> &
  Partial<Pick<LeadRow, "id" | "status">>;

export type CompanyRow = {
  id: string;
  name: string;
  cvr: string | null;
  industry: string | null;
  employee_range: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type LeadEventRow = {
  id: number;
  created_at: string;
  lead_id: string | null;
  session_id: string | null;
  event_type: string;
  step_id: string | null;
  step_index: number | null;
  lead_type: LeadTypeDb | null;
  landing_page: string | null;
  actor_id: string | null;
  payload: Record<string, unknown>;
};

export type LeadNoteRow = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string;
  author_id: string | null;
  body: string;
};

export type AppointmentRow = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string;
  advisor_id: string | null;
  type: AppointmentTypeDb;
  status: AppointmentStatusDb;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
  provider: string | null;
  external_id: string | null;
};

export type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRoleDb;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ConsentRecordRow = {
  id: string;
  created_at: string;
  purpose: string;
  consent_text: string;
  consent_version: number;
  granted: boolean;
  ip_prefix: string | null;
  user_agent: string | null;
};

export type NotificationRow = {
  id: string;
  created_at: string;
  lead_id: string | null;
  channel: string;
  template: string;
  recipient: string | null;
  payload: Record<string, unknown>;
  status: string;
  sent_at: string | null;
  error: string | null;
};

/** Shape consumed by `createClient<Database>()`. */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      companies: {
        Row: CompanyRow;
        Insert: Partial<CompanyRow> & { name: string };
        Update: Partial<CompanyRow>;
        Relationships: [];
      };
      lead_events: {
        Row: LeadEventRow;
        Insert: Partial<Omit<LeadEventRow, "id">> & { event_type: string };
        Update: Partial<LeadEventRow>;
        Relationships: [];
      };
      lead_notes: {
        Row: LeadNoteRow;
        Insert: Partial<Omit<LeadNoteRow, "id">> & { lead_id: string; body: string };
        Update: Partial<LeadNoteRow>;
        Relationships: [];
      };
      appointments: {
        Row: AppointmentRow;
        Insert: Partial<Omit<AppointmentRow, "id">> & {
          lead_id: string;
          starts_at: string;
          ends_at: string;
        };
        Update: Partial<AppointmentRow>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: Partial<AdminUserRow> & { id: string; email: string };
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
      consent_records: {
        Row: ConsentRecordRow;
        Insert: Partial<Omit<ConsentRecordRow, "id">> & {
          purpose: string;
          consent_text: string;
          granted: boolean;
        };
        Update: Partial<ConsentRecordRow>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<Omit<NotificationRow, "id">> & {
          channel: string;
          template: string;
        };
        Update: Partial<NotificationRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      lead_type: LeadTypeDb;
      lead_status: LeadStatusDb;
      lead_temperature: LeadTemperatureDb;
      contact_method: ContactMethodDb;
      appointment_type: AppointmentTypeDb;
      appointment_status: AppointmentStatusDb;
      admin_role: AdminRoleDb;
    };
    CompositeTypes: Record<never, never>;
  };
};
