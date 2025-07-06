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

// Simple email regex for demonstration
function isValidEmail(email) {
    return typeof email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password: at least 8 chars, at least one letter and one number
function isValidPassword(password) {
    return typeof password === 'string' &&
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password);
}

// Name: only letters, spaces, hyphens, apostrophes, 2-50 chars
function isValidName(name) {
    return typeof name === 'string' &&
        /^[A-Za-z\s\-']{2,50}$/.test(name.trim());
}

// Sanitize string fields (trim, remove dangerous chars)
function sanitizeString(str) {
    return str.replace(/[<>]/g, '').trim();
}

export async function handleSignup(request, env) {
    let signupData;
    try {
        signupData = await request.json();
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Input validation
    const { email, password, name } = signupData || {};
    if (!isValidEmail(email)) {
        return new Response('Invalid email', { status: 400 });
    }
    if (!isValidPassword(password)) {
        return new Response('Invalid password', { status: 400 });
    }
    if (!isValidName(name)) {
        return new Response('Invalid name', { status: 400 });
    }

    // Sanitize input
    const cleanData = {
        email: sanitizeString(email),
        password: sanitizeString(password),
        name: sanitizeString(name)
    };

    const backendUrl = env.BACKEND_URL;
    if (!backendUrl) {
        return new Response('Backend URL not configured', { status: 500 });
    }

    try {
        const { status, body } = await postJson(backendUrl, JSON.stringify(cleanData));
        return new Response(body, { status });
    } catch (e) {
        return new Response(`Backend error: ${e.message}`, { status: 502 });
    }
}
