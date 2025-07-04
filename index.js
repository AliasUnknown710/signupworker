import { main, handle_signup } from './signupworker.js';

// Cloudflare Worker expects a fetch handler
export default {
  async fetch(request, env, ctx) {
    // You may want to parse the request and call your main/handle_signup
    const reqBody = await request.text();
    const req = {
      method: request.method,
      body: reqBody
    };
    const result = main(req);
    return new Response(result.body, { status: result.status });
  }
};
