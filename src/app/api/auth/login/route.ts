import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { rateLimit, rateLimits } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(rateLimits.login)(request);
    if (rateLimitResult) return rateLimitResult;

    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Get user
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const { token: refreshToken, familyId } = await generateRefreshToken(user.id);

        // Create response
        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                accessToken,
            },
            { status: 200 }
        );

        // Set HTTP-only cookies
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
