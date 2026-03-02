export function contactEmailHtml(data: { name: string; email: string; company?: string; message: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1a1a1a;">
      <h1 style="color:#00f2ff;font-size:22px;margin:0;letter-spacing:2px;">CYPHRIX</h1>
      <p style="color:#666;font-size:12px;margin:4px 0 0;letter-spacing:1px;">SECURE CHANNEL — NEW CONTACT</p>
    </div>
    <!-- Info cards -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="padding:12px 16px;background:#111;border-left:3px solid #00f2ff;border-radius:4px;">
          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">From</p>
          <p style="color:#fff;font-size:15px;margin:0;font-weight:600;">${data.name}</p>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background:#111;border-left:3px solid #00f2ff;border-radius:4px;">
          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Email</p>
          <p style="color:#00f2ff;font-size:15px;margin:0;"><a href="mailto:${data.email}" style="color:#00f2ff;text-decoration:none;">${data.email}</a></p>
        </td>
      </tr>
      ${data.company ? `
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background:#111;border-left:3px solid #00f2ff;border-radius:4px;">
          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Company</p>
          <p style="color:#fff;font-size:15px;margin:0;">${data.company}</p>
        </td>
      </tr>` : ''}
    </table>
    <!-- Message -->
    <div style="background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#888;font-size:11px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
      <p style="color:#e0e0e0;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${data.message}</p>
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #1a1a1a;">
      <p style="color:#555;font-size:11px;margin:0;">Sent via <span style="color:#00f2ff;">cyphrixtech.com</span> contact form</p>
    </div>
  </div>
</body>
</html>`;
}

export function auditEmailHtml(data: {
  projectName: string;
  email: string;
  auditType: string;
  telegram?: string;
  details: Record<string, string>;
  notes?: string;
}) {
  const detailRows = Object.entries(data.details)
    .filter(([, v]) => v)
    .map(([k, v]) => `
      <tr>
        <td style="padding:8px 16px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;vertical-align:top;">${k}</td>
        <td style="padding:8px 16px;color:#fff;font-size:14px;">${v}</td>
      </tr>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1a1a1a;">
      <h1 style="color:#00f2ff;font-size:22px;margin:0;letter-spacing:2px;">CYPHRIX</h1>
      <p style="color:#666;font-size:12px;margin:4px 0 0;letter-spacing:1px;">AUDIT REQUEST — ${data.auditType.toUpperCase()}</p>
    </div>
    <!-- Project & Contact -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="padding:12px 16px;background:#111;border-left:3px solid #00f2ff;border-radius:4px;">
          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Project</p>
          <p style="color:#fff;font-size:16px;margin:0;font-weight:700;">${data.projectName}</p>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background:#111;border-left:3px solid #00f2ff;border-radius:4px;">
          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Contact Email</p>
          <p style="color:#00f2ff;font-size:15px;margin:0;"><a href="mailto:${data.email}" style="color:#00f2ff;text-decoration:none;">${data.email}</a></p>
        </td>
      </tr>
      ${data.telegram ? `
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background:#111;border-left:3px solid #00f2ff;border-radius:4px;">
          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Telegram / Discord</p>
          <p style="color:#fff;font-size:15px;margin:0;">${data.telegram}</p>
        </td>
      </tr>` : ''}
    </table>
    <!-- Audit type badge -->
    <div style="text-align:center;margin:16px 0 24px;">
      <span style="display:inline-block;background:#00f2ff;color:#000;font-size:12px;font-weight:700;padding:6px 18px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">${data.auditType}</span>
    </div>
    <!-- Details table -->
    <div style="background:#111;border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRows}
      </table>
    </div>
    ${data.notes ? `
    <!-- Notes -->
    <div style="background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#888;font-size:11px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Additional Notes</p>
      <p style="color:#e0e0e0;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${data.notes}</p>
    </div>` : ''}
    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #1a1a1a;">
      <p style="color:#555;font-size:11px;margin:0;">Sent via <span style="color:#00f2ff;">cyphrixtech.com</span> audit request form</p>
    </div>
  </div>
</body>
</html>`;
}
