const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' folder (adjust if your build folder has a different name)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory store (for demo). Replace with persistent store in production.
const paymentSessions = new Map(); // key: sessionId, value: { customer, plan, status, invoice }

// Helpers
function verifyIpnSignature(req) {
  const secret = process.env.IPN_SECRET || '';
  if (!secret) return true; // if not configured, skip verification (dev only)
  const signature = req.header('x-ipn-signature') || '';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const expected = hmac.digest('hex');
  return signature === expected;
}

async function createInvoiceWithInvoiceMaven({ customer, planAmount, planName, externalId }) {
  const token = process.env.INVOICE_MAVEN_TOKEN;
  if (!token) throw new Error('Missing INVOICE_MAVEN_TOKEN');
  const url = 'https://www.invoice-maven.co.il/api/addDocument';
  const payload = {
    type: 320, // מס קבלה
    description: `שיעור פרטי במיינקראפט – ${planName} (כולל מע"מ)`,
    items: [
      { description: `שיעור פרטי במיינקראפט – ${planName} (כולל מע"מ)`, quantity: 1, price: planAmount }
    ],
    customer: {
      name: customer.parentName,
      email: customer.parentEmail,
      phone: customer.parentPhone,
    },
    external_id: externalId,
  };
  const { data } = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data; // expect {url, number, ...}
}

async function sendDiscordWebhook({ content, embed }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  await axios.post(webhookUrl, { content, embeds: embed ? [embed] : [] });
}

// API routes
app.post('/api/session/init', (req, res) => {
  const { parentEmail, parentPhone, parentName, childName, childAge, childGender, level, knowsNow, goals, otherGoal, notes } = req.body;
  const { planKey, planAmount, planName } = req.body;
  const sessionId = uuidv4();
  paymentSessions.set(sessionId, {
    customer: { parentEmail, parentPhone, parentName, childName, childAge, childGender, level, knowsNow, goals, otherGoal, notes },
    plan: { planKey, planAmount, planName },
    status: 'initialized',
  });
  // Redirect URL to PSP would be generated on FE; return sessionId and continue
  res.json({ sessionId });
});

app.get('/api/session/status/:id', (req, res) => {
  const s = paymentSessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'not_found' });
  res.json({ status: s.status, invoice: s.invoice || null });
});

// IPN endpoint (called by PSP)
app.post('/api/ipn', async (req, res) => {
  try {
    if (!verifyIpnSignature(req)) {
      return res.status(401).json({ ok: false, error: 'invalid_signature' });
    }
    const { sessionId, transactionId, status, amount } = req.body;
    const s = paymentSessions.get(sessionId);
    if (!s) return res.status(404).json({ ok: false, error: 'session_not_found' });

    // Idempotency: if already paid with invoice, ack without duplicating
    if (s.status === 'paid' && s.invoice) {
      return res.json({ ok: true, idempotent: true });
    }

    if (status !== 'paid') {
      s.status = status;
      paymentSessions.set(sessionId, s);
      return res.json({ ok: true });
    }

    // Mark paid
    s.status = 'paid';
    s.transactionId = transactionId;

    // Create invoice
    const invoice = await createInvoiceWithInvoiceMaven({
      customer: s.customer,
      planAmount: s.plan.planAmount,
      planName: s.plan.planName,
      externalId: transactionId || sessionId,
    });
    s.invoice = invoice;
    paymentSessions.set(sessionId, s);

    // Send Discord webhook
    const content = `<@145679462585991169> הזמנה חדשה – ${s.customer.parentName} | ${s.customer.parentPhone}`;
    const embed = {
      title: 'פרטי הרשמה ותשלום',
      fields: [
        { name: 'הורה', value: `${s.customer.parentName} | ${s.customer.parentEmail} | ${s.customer.parentPhone}` },
        { name: 'ילדכם', value: `${s.customer.childName}, גיל ${s.customer.childAge}, ${s.customer.childGender}` },
        { name: 'רמה', value: s.customer.level },
        { name: 'מה יודע היום', value: s.customer.knowsNow || '-' },
        { name: 'מטרות', value: (Array.isArray(s.customer.goals) ? s.customer.goals.join(', ') : s.customer.goals) || '-' },
        { name: 'מסלול', value: `${s.plan.planName} – ${s.plan.planAmount}₪` },
        { name: 'מזהה עסקה', value: transactionId || '-' },
        { name: 'חשבונית', value: invoice?.url || '-' },
      ],
    };
    await sendDiscordWebhook({ content, embed });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// For SPA fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});