import { Resend } from "resend";

type OrderPayload = {
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
};

/**
 * Sends a new-order notification to the bakery owner.
 * No-ops (logs a warning) if Resend isn't configured, so the order flow
 * never depends on email being set up.
 */
export async function sendOrderNotification(order: OrderPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !to) {
    console.warn(
      "Resend not configured (need RESEND_API_KEY, RESEND_FROM_EMAIL, ORDER_NOTIFICATION_EMAIL) — skipping order email."
    );
    return;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.porchlightflavorco.com";
  const crmUrl = `${siteUrl}/crm`;

  const row = (label: string, value: string | null) =>
    value
      ? `<tr>
           <td style="padding:6px 12px;color:#5a5a58;font-size:13px;vertical-align:top;white-space:nowrap;">${label}</td>
           <td style="padding:6px 12px;color:#1c1c1c;font-size:14px;">${value}</td>
         </tr>`
      : "";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#f7f7f5;padding:24px;">
    <div style="background:#ffffff;border:1px solid #e0e0de;border-radius:16px;overflow:hidden;">
      <div style="background:#1c1c1c;padding:20px 24px;">
        <p style="margin:0;color:#8b1f1f;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:bold;">New Order Request</p>
        <p style="margin:4px 0 0;color:#ffffff;font-size:20px;">Porch Light Flavor Co.</p>
      </div>
      <div style="padding:20px 12px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("Name", order.name)}
          ${row("Email", `<a href="mailto:${order.email}" style="color:#8b1f1f;">${order.email}</a>`)}
          ${row("Phone", `<a href="tel:${order.phone}" style="color:#8b1f1f;">${order.phone}</a>`)}
          ${row("Interested in", order.interests.join(", "))}
          ${row("Details", order.product_details)}
          ${row("Quantity", order.quantity)}
          ${row("Desired date", order.desired_date)}
          ${row("Fulfillment", order.fulfillment)}
          ${row("Event type", order.event_type)}
          ${row("Payment", order.payment_method)}
          ${row("Notes", order.notes)}
        </table>
      </div>
      <div style="padding:0 24px 24px;text-align:center;">
        <a href="${crmUrl}" style="display:inline-block;background:#8b1f1f;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:999px;">Open the CRM</a>
      </div>
    </div>
    <p style="text-align:center;color:#9a9a98;font-size:11px;margin-top:16px;">This order was also saved to your dashboard.</p>
  </div>`;

  const text = [
    "New order request — Porch Light Flavor Co.",
    "",
    `Name: ${order.name}`,
    `Email: ${order.email}`,
    `Phone: ${order.phone}`,
    `Interested in: ${order.interests.join(", ")}`,
    order.product_details ? `Details: ${order.product_details}` : "",
    order.quantity ? `Quantity: ${order.quantity}` : "",
    order.desired_date ? `Desired date: ${order.desired_date}` : "",
    order.fulfillment ? `Fulfillment: ${order.fulfillment}` : "",
    order.event_type ? `Event type: ${order.event_type}` : "",
    order.payment_method ? `Payment: ${order.payment_method}` : "",
    order.notes ? `Notes: ${order.notes}` : "",
    "",
    `Open the CRM: ${crmUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    replyTo: order.email,
    subject: `New order request from ${order.name}`,
    html,
    text,
  });
}
