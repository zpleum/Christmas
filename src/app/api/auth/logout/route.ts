import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, revokeAllUserTokens } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Get access token from cookie
        const accessToken = request.cookies.get('accessToken')?.value;

        if (accessToken) {
            const payload = verifyAccessToken(accessToken);
            if (payload) {
                // Revoke all refresh tokens for this user
                await revokeAllUserTokens(payload.userId);
            }
        }

        // Create response
        const response = NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        );

        // Clear cookies
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
