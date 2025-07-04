// Helper to make HTTP(S) POST requests using fetch
async function postJson(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });
    const body = await response.text();
    return { status: response.status, body };
}

async function handleSignup(request) {
    let signupData;
    try {
        signupData = await request.json();
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    const backendUrl = BACKEND_URL;
    if (!backendUrl) {
        return new Response('Backend URL not configured', { status: 500 });
    }

    try {
        const { status, body } = await postJson(backendUrl, JSON.stringify(signupData));
        return new Response(body, { status });
    } catch (e) {
        return new Response(`Backend error: ${e.message}`, { status: 502 });
    }
}

addEventListener('fetch', event => {
    event.respondWith(main(event.request));
});

const BACKEND_URL = 'https://your-backend-domain.com/api/loginpw1'; // Set this to your backend URL

async function main(request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }
    return await handleSignup(request);
}
