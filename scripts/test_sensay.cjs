const fs = require('fs');
const path = require('path');

// Manual .env loader (no external deps)
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  });
}

const key = process.env.VITE_SENSAY_API_KEY || process.env.SENSAY_API_KEY;
const base = process.env.VITE_SENSAY_API_URL || process.env.SENSAY_API_URL || 'https://api.sensay.io/v1';

if (!key) {
  console.error('NO_KEY');
  process.exit(2);
}

const url = base.replace(/\/$/, '') + '/chat/completions';

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'sensay-llama-3',
        messages: [
          { role: 'system', content: "You are a short-test assistant. Reply briefly." },
          { role: 'user', content: 'Hello — please respond with a short test acknowledgement.' }
        ]
      }),
    });

    const text = await res.text();
    // redact key occurrences
    const redacted = text.replace(new RegExp(key, 'g'), '[REDACTED]');

    console.log('STATUS', res.status);
    // Try to parse JSON and extract first likely reply
    try {
      const data = JSON.parse(redacted);
      let reply = null;
      if (data?.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) {
        reply = data.choices[0].message.content;
      } else if (data?.content) {
        reply = data.content;
      }
      console.log('REPLY', reply ?? JSON.stringify(data));
    } catch (e) {
      console.log('RESPONSE_TEXT', redacted);
    }
  } catch (err) {
    console.error('ERR', String(err));
    process.exit(1);
  }
})();
