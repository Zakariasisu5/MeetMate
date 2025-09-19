const fs = require('fs');
const path = require('path');

// Load .env manually
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
const userId = process.env.VITE_SENSAY_USER_ID || process.env.SENSAY_USER_ID || '';
const base = (process.env.VITE_SENSAY_API_URL || process.env.SENSAY_API_URL || 'https://api.sensay.io/v1').replace(/\/$/, '');

if (!key) {
  console.error('NO_KEY');
  process.exit(2);
}

(async () => {
  try {
    // List replicas
    const listUrl = `${base}/replicas`;
    const listRes = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-ORGANIZATION-SECRET': key,
      },
    });

    const listText = await listRes.text();
    let listData;
    try { listData = JSON.parse(listText); } catch (e) { listData = null; }

    if (!listRes.ok) {
      console.error('LIST_STATUS', listRes.status, 'BODY', listText.replace(new RegExp(key, 'g'), '[REDACTED]'));
      process.exit(1);
    }

    const items = listData?.items || listData || [];
    if (!Array.isArray(items) || items.length === 0) {
      console.error('NO_REPLICA', JSON.stringify(listData).replace(new RegExp(key, 'g'), '[REDACTED]'));
      process.exit(1);
    }

    const replicaUuid = items[0].uuid || items[0]?.id || items[0]?.slug;
    if (!replicaUuid) {
      console.error('NO_REPLICA_UUID', JSON.stringify(items[0]).replace(new RegExp(key, 'g'), '[REDACTED]'));
      process.exit(1);
    }

    // Post a test message to the replica
    const replicaUrl = `${base}/replicas/${encodeURIComponent(replicaUuid)}/chat/completions`;
    const headers = {
      'Content-Type': 'application/json',
      'X-ORGANIZATION-SECRET': key,
    };
    if (userId) headers['X-USER-ID'] = userId;

    const payload = {
      content: 'Hello from test script — please respond briefly.',
      source: 'web',
      skip_chat_history: false,
    };

    const resp = await fetch(replicaUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    const redacted = text.replace(new RegExp(key, 'g'), '[REDACTED]');

    // Try to extract reply
    let reply = null;
    try {
      const data = JSON.parse(redacted);
      if (data?.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) reply = data.choices[0].message.content;
      else if (data?.content) reply = data.content;
      else if (data?.choices && Array.isArray(data.choices) && data.choices[0]?.text) reply = data.choices[0].text;
      else reply = JSON.stringify(data);
    } catch (e) {
      reply = redacted;
    }

    console.log('STATUS', resp.status);
    console.log('REPLICA_UUID', replicaUuid);
    console.log('REPLY', reply);
  } catch (err) {
    console.error('ERR', String(err));
    process.exit(1);
  }
})();
