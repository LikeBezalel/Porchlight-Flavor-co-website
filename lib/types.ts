export type OrderStatus =
  | "new_request"
  | "needs_followup"
  | "quote_sent"
  | "payment_pending"
  | "confirmed"
  | "in_progress"
  | "ready"
  | "completed"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "new_request",
  "needs_followup",
  "quote_sent",
  "payment_pending",
  "confirmed",
  "in_progress",
  "ready",
  "completed",
  "cancelled",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new_request: "New Request",
  needs_followup: "Needs Follow-up",
  quote_sent: "Quote Sent",
  payment_pending: "Payment Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type Order = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  product_details: string | null;
  quantity: string | null;
  desired_date: string | null;
  fulfillment: string | null;
  event_type: string | null;
  notes: string | null;
  payment_method: string | null;
  status: OrderStatus;
  internal_notes: string | null;
};

export type OrderFormData = {
  name: string;
  email: string;
  phone: string;
  interests: string[];
  product_details: string;
  quantity: string;
  desired_date: string;
  fulfillment: string;
  event_type: string;
  notes: string;
  payment_method: string;
};
