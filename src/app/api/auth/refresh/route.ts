import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, getUserById } from '@/lib/auth';
import { rateLimit, rateLimits } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(rateLimits.refresh)(request);
    if (rateLimitResult) return rateLimitResult;

    try {
        // Get refresh token from cookie
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token not found' },
                { status: 401 }
            );
        }

        // Verify refresh token (includes rotation and reuse detection)
        const tokenData = await verifyRefreshToken(refreshToken);

        if (!tokenData) {
            return NextResponse.json(
                { error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        // Get user
        const user = await getUserById(tokenData.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate new token pair (rotation)
        const newAccessToken = generateAccessToken(user);
        const { token: newRefreshToken } = await generateRefreshToken(user.id, tokenData.familyId);

        // Create response
        const response = NextResponse.json(
            {
                message: 'Tokens refreshed successfully',
                accessToken: newAccessToken,
            },
            { status: 200 }
        );

        // Set new HTTP-only cookies
        response.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        });

        response.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Token refresh error:', error);

        // Token reuse detected
        if (error.message === 'Token reuse detected') {
            return NextResponse.json(
                { error: 'Security breach detected. All tokens have been invalidated.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
