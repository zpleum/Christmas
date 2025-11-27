import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

// Rate limit configuration
interface RateLimitConfig {
    interval: number; // Time window in milliseconds
    uniqueTokenPerInterval: number; // Max requests per interval
}

// Create LRU cache for rate limiting
const tokenCache = new LRUCache<string, number[]>({
    max: 500, // Maximum number of IPs to track
    ttl: 60000, // 1 minute TTL
});

/**
 * Rate limiting middleware
 * @param config Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(config: RateLimitConfig) {
    return async (request: NextRequest): Promise<NextResponse | null> => {
        // Get client IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const tokenKey = `${ip}`;
        const now = Date.now();
        const timestamps = tokenCache.get(tokenKey) || [];

        // Filter out old timestamps outside the interval
        const validTimestamps = timestamps.filter(
            (timestamp) => now - timestamp < config.interval
        );

        // Check if rate limit exceeded
        if (validTimestamps.length >= config.uniqueTokenPerInterval) {
            const oldestTimestamp = validTimestamps[0];
            const retryAfter = Math.ceil((config.interval - (now - oldestTimestamp)) / 1000);

            return NextResponse.json(
                {
                    error: 'Too many requests',
                    message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': config.uniqueTokenPerInterval.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(oldestTimestamp + config.interval).toISOString(),
                    },
                }
            );
        }

        // Add current timestamp
        validTimestamps.push(now);
        tokenCache.set(tokenKey, validTimestamps);

        return null; // No rate limit hit, continue
    };
}

// Predefined rate limit configurations
export const rateLimits = {
    login: { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 5 }, // 5 per 15 min
    register: { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 3 }, // 3 per hour
    refresh: { interval: 60 * 1000, uniqueTokenPerInterval: 10 }, // 10 per minute
    general: { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 100 }, // 100 per 15 min
};
