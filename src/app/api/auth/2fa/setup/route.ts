import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, getUserById } from '@/lib/auth';
import { generateSecret, generateQRCode, formatSecretForDisplay } from '@/lib/twoFactor';

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const accessToken = request.cookies.get('accessToken')?.value;
        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyAccessToken(accessToken);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Get user
        const user = await getUserById(payload.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if 2FA already enabled
        const userWithTwoFactor = await getUserById(payload.userId) as any;
        if (userWithTwoFactor.two_factor_enabled) {
            return NextResponse.json(
                { error: '2FA is already enabled' },
                { status: 400 }
            );
        }

        // Generate new secret
        const secret = generateSecret();

        // Generate QR code
        const qrCodeDataURL = await generateQRCode(user.email, secret);

        // Format secret for manual entry
        const formattedSecret = formatSecretForDisplay(secret);

        // Return QR code and secret (NOT encrypted yet - only encrypt when saving)
        // Store secret temporarily in session or return to client
        return NextResponse.json({
            qrCode: qrCodeDataURL,
            secret: formattedSecret,
            rawSecret: secret, // For verification, will be encrypted when enabling
        });
    } catch (error) {
        console.error('2FA setup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
