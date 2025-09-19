

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing `message` in request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const SENSAY_API_KEY = process.env.SENSAY_API_KEY;
    if (!SENSAY_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server not configured: missing SENSAY_API_KEY' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Determine replica UUID to use. Prefer env var SENSAY_REPLICA_UUID; otherwise list replicas and pick the first one.
    let replicaUuid = process.env.SENSAY_REPLICA_UUID;
    if (!replicaUuid) {
      const listResp = await fetch('https://api.sensay.io/v1/replicas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_API_KEY
        }
      });

      if (!listResp.ok) {
        const txt = await listResp.text();
        console.error('Failed listing replicas', listResp.status, txt);
        return new Response(JSON.stringify({ error: 'Failed to list replicas', details: txt }), { status: listResp.status, headers: { 'Content-Type': 'application/json' } });
      }

      const listData = await listResp.json();
      if (listData?.items && Array.isArray(listData.items) && listData.items.length > 0) {
        replicaUuid = listData.items[0].uuid;
      }
    }

    // If we still don't have a replica, try to create one programmatically using the org key and SENSAY_USER_ID
    if (!replicaUuid) {
      const SENSAY_USER_ID = process.env.SENSAY_USER_ID;
      if (!SENSAY_USER_ID) {
        return new Response(JSON.stringify({ error: 'No replica UUID and missing SENSAY_USER_ID. Set SENSAY_USER_ID in .env.local or create a user in Sensay.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      // Ensure user exists
      const getUserResp = await fetch(`https://api.sensay.io/v1/users/${encodeURIComponent(SENSAY_USER_ID)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_API_KEY
        }
      });

      if (!getUserResp.ok) {
        if (getUserResp.status === 404) {
          const createUserResp = await fetch('https://api.sensay.io/v1/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-ORGANIZATION-SECRET': SENSAY_API_KEY
            },
            body: JSON.stringify({ id: SENSAY_USER_ID, name: SENSAY_USER_ID })
          });

          if (!createUserResp.ok) {
            const txt = await createUserResp.text();
            console.error('Failed to create user', createUserResp.status, txt);
            return new Response(JSON.stringify({ error: 'Failed to create user', details: txt }), { status: createUserResp.status, headers: { 'Content-Type': 'application/json' } });
          }
        } else {
          const txt = await getUserResp.text();
          console.error('Failed to get user', getUserResp.status, txt);
          return new Response(JSON.stringify({ error: 'Failed to get user', details: txt }), { status: getUserResp.status, headers: { 'Content-Type': 'application/json' } });
        }
      }

      // Create a new replica owned by this user
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const slug = `autogen-replica-${timestamp}-${randomStr}`;

      const createReplicaResp = await fetch('https://api.sensay.io/v1/replicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_API_KEY
        },
        body: JSON.stringify({
          name: 'AIchat Replica',
          shortDescription: 'Auto-created replica for AIchat',
          greeting: "Hello, I'm your AIchat replica.",
          slug,
          ownerID: SENSAY_USER_ID,
          llm: {
            model: 'claude-3-7-sonnet-latest',
            memoryMode: 'prompt-caching',
            systemMessage: "You are a helpful assistant."
          }
        })
      });

      if (!createReplicaResp.ok) {
        const txt = await createReplicaResp.text();
        console.error('Failed to create replica', createReplicaResp.status, txt);
        return new Response(JSON.stringify({ error: 'Failed to create replica', details: txt }), { status: createReplicaResp.status, headers: { 'Content-Type': 'application/json' } });
      }

      const created = await createReplicaResp.json();
      replicaUuid = created.uuid;
      console.log('Auto-created replica UUID', replicaUuid);
    }

    const sensayUrl = `https://api.sensay.io/v1/replicas/${replicaUuid}/chat/completions`;

    const SENSAY_USER_ID = process.env.SENSAY_USER_ID;
    if (!SENSAY_USER_ID) {
      return new Response(JSON.stringify({ error: 'Server not configured: missing SENSAY_USER_ID. Set SENSAY_USER_ID in .env.local or create a user for the organization and set that value.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const headers: Record<string,string> = {
      'Content-Type': 'application/json',
      'X-ORGANIZATION-SECRET': SENSAY_API_KEY,
      'X-API-Version': process.env.SENSAY_API_VERSION ?? '2025-03-25',
      'X-USER-ID': SENSAY_USER_ID
    };

    const resp = await fetch(sensayUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: message,
        source: 'web',
        skip_chat_history: false
      })
    });

    if (!resp.ok) {
      let bodyText: string;
      try {
        const json = await resp.json();
        bodyText = JSON.stringify(json);
      } catch (e) {
        bodyText = await resp.text();
      }
      console.error('Sensay API error', resp.status, bodyText);
      return new Response(JSON.stringify({ error: 'Sensay API error', details: bodyText }), { status: resp.status, headers: { 'Content-Type': 'application/json' } });
    }

    const data = await resp.json();

    let content = '';
    if (data?.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) {
      content = data.choices[0].message.content;
    } else if (data?.choices && Array.isArray(data.choices) && data.choices[0]?.text) {
      content = data.choices[0].text;
    } else if (data?.content && typeof data.content === 'string') {
      content = data.content;
    } else {
      content = JSON.stringify(data);
    }

    return new Response(JSON.stringify({ content }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('Proxy error', err);
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
