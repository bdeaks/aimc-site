// Vercel serverless function — AIMC contact form → Resend
// No dependencies. Uses Resend REST API via fetch.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit simple (per-VM, resets on cold start)
  if (!global._aimcRate) global._aimcRate = new Map();
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const entry = global._aimcRate.get(ip);
  if (entry && now - entry.ts < 60000) {
    if (entry.count >= 3) return res.status(429).json({ error: 'Trop de requêtes.' });
    entry.count++;
  } else {
    global._aimcRate.set(ip, { count: 1, ts: now });
  }

  try {
    const { prenom, tel, email, sujet, message, _hp, _ts } = req.body;

    // Honeypot
    if (_hp) return res.status(200).json({ success: true });
    // Bot timing
    if (_ts && now - Number(_ts) < 3000) return res.status(200).json({ success: true });

    if (!email || !message) {
      return res.status(400).json({ error: 'Email et message requis.' });
    }

    const contactEmail = process.env.CONTACT_EMAIL || 'pbaudoux@gmail.com';
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      return res.status(503).json({ error: 'Service indisponible.' });
    }

    const subject = `[AIMC] ${sujet || 'Nouveau message'} — ${prenom || ''}`.trim();

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AIMC Contact <contact@aimc.dev>',
        to: contactEmail,
        reply_to: email,
        subject,
        html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0C0C0A;color:#FAF7F2;padding:32px;border-radius:12px;">
<div style="margin-bottom:24px;"><span style="background:#B6FF00;color:#0C0C0A;font-weight:800;font-size:11px;letter-spacing:.1em;padding:4px 10px;border-radius:99px;">NOUVEAU CONTACT AIMC</span></div>
<h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#FAF7F2;">${prenom || ''}</h2>
<p style="margin:0 0 4px;color:#8A8580;font-size:14px;">${email}</p>
${tel ? `<p style="margin:0 0 4px;color:#8A8580;font-size:14px;">${tel}</p>` : ''}
${sujet ? `<p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#B6FF00;font-weight:700;">${sujet}</p>` : ''}
<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:16px;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</div>
<div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:#8A8580;">Répondre directement à cet email pour contacter ${prenom || 'le visiteur'}.</div>
</div>`,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('[contact] Resend error:', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[contact] Error:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
}
