import { json } from 'astro:content';
import fetch from 'node-fetch';

const TURNSTILE_SECRET_KEY = import.meta.env.PUBLIC_TURNSTILE_SECRET_KEY;
const SECRET_KEY = {TURNSTILE_SECRET_KEY}; // Replace with your actual secret key

export async function post({ request }) {
    const { 'cf-turnstile-response': cfTurnstileResponse } = await request.json();
    const remoteip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for');

    // Validate the Turnstile response
    const validationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            secret: SECRET_KEY,
            response: cfTurnstileResponse,
            remoteip,
        }),
    });

    const validationResult = await validationResponse.json();

    if (!validationResult.success) {
        return json({ error: 'CAPTCHA validation failed', messages: validationResult['error-codes'] }, { status: 400 });
    }

    // Proceed with your form submission logic here
    return json({ message: 'Form submitted successfully!' });
}