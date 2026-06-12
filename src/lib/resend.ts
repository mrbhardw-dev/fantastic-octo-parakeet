import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = 'baile.fyi <hello@baile.fyi>'

export async function sendWelcomeEmail(to: string, displayName: string) {
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Welcome to baile.fyi — Kilcock\'s community noticeboard',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
        <h1 style="color:#16a34a;font-size:28px;margin-bottom:8px">Welcome to baile.fyi!</h1>
        <p style="color:#374151;font-size:16px;line-height:1.6">
          Dia dhuit ${displayName},
        </p>
        <p style="color:#374151;font-size:16px;line-height:1.6">
          You're now part of Kilcock's local community noticeboard. Share updates, find local events,
          browse the directory, and connect with your neighbours.
        </p>
        <a href="https://baile.fyi/feed"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#16a34a;color:white;text-decoration:none;border-radius:8px;font-size:16px">
          View the local feed
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">
          baile.fyi · Kilcock, Co. Kildare
        </p>
      </div>
    `,
  })
}

export async function sendModerationEmail(
  to: string,
  displayName: string,
  contentType: string,
  contentTitle: string,
  status: 'approved' | 'rejected',
  rejectReason?: string,
) {
  const isApproved = status === 'approved'
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Your ${contentType} has been ${status} — baile.fyi`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
        <h1 style="color:#16a34a;font-size:24px;margin-bottom:8px">baile.fyi</h1>
        <p style="color:#374151;font-size:16px;line-height:1.6">Hi ${displayName},</p>
        <p style="color:#374151;font-size:16px;line-height:1.6">
          Your ${contentType} <strong>"${contentTitle}"</strong> has been
          <strong style="color:${isApproved ? '#16a34a' : '#dc2626'}">${status}</strong>.
        </p>
        ${!isApproved && rejectReason ? `<p style="color:#6b7280;font-size:15px">Reason: ${rejectReason}</p>` : ''}
        <a href="https://baile.fyi/feed"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#16a34a;color:white;text-decoration:none;border-radius:8px;font-size:16px">
          Visit baile.fyi
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">
          baile.fyi · Kilcock, Co. Kildare
        </p>
      </div>
    `,
  })
}
