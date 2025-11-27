// Cloudflare Turnstile Types

export interface TurnstileVerifyResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    'error-codes'?: string[];
    action?: string;
    cdata?: string;
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    captchaToken: string;
}
