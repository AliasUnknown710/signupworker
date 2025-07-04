const https = require('https');
const http = require('http');
const { URL } = require('url');

// Helper to make HTTP(S) POST requests
function postJson(urlString, data) {
    return new Promise((resolve, reject) => {
        const url = new URL(urlString);
        const isHttps = url.protocol === 'https:';
        const options = {
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const reqModule = isHttps ? https : http;
        const req = reqModule.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function handleSignup(requestBody) {
    let signupData;
    try {
        signupData = JSON.parse(requestBody);
    } catch {
        return { status: 400, body: 'Invalid JSON' };
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
        return { status: 500, body: 'Backend URL not configured' };
    }

    try {
        const { status, body } = await postJson(backendUrl, JSON.stringify(signupData));
        return { status, body };
    } catch (e) {
        return { status: 502, body: `Backend error: ${e.message}` };
    }
}

async function main(request) {
    if (request.method !== 'POST') {
        return { status: 405, body: 'Method Not Allowed' };
    }
    return await handleSignup(request.body);
}

// Example usage for local testing:
if (require.main === module) {
    // Simulate a POST request with JSON body
    const testRequest = {
        method: 'POST',
        body: JSON.stringify({ username: 'test', password: 'secret' })
    };
    // Set environment variable for local test
    process.env.BACKEND_URL = 'https://your-backend-domain.com/api/loginpw1';
    main(testRequest).then(response => {
        console.log('Status:', response.status);
        console.log('Body:', response.body);
    });
}