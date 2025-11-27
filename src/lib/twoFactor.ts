import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.TWO_FACTOR_ENCRYPTION_KEY || '';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    console.warn('⚠️  TWO_FACTOR_ENCRYPTION_KEY not set or too short. Using default (INSECURE!)');
}

/**
 * Encrypt TOTP secret using AES-256-GCM
 */
export function encryptSecret(secret: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        ENCRYPTION_ALGORITHM,
        Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
        iv
    );

    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt TOTP secret
 */
export function decryptSecret(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
        ENCRYPTION_ALGORITHM,
        Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
        iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Generate new TOTP secret
 */
export function generateSecret(): string {
    return authenticator.generateSecret();
}

/**
 * Generate QR code data URL for authenticator app
 */
export async function generateQRCode(email: string, secret: string): Promise<string> {
    const appName = 'zPleum Portfolio';
    const otpauth = authenticator.keyuri(email, appName, secret);

    try {
        const qrCodeDataURL = await QRCode.toDataURL(otpauth);
        return qrCodeDataURL;
    } catch (error) {
        console.error('QR code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Verify TOTP token
 */
export function verifyToken(token: string, secret: string): boolean {
    try {
        // Remove spaces and validate format
        const cleanToken = token.replace(/\s/g, '');
        if (!/^\d{6}$/.test(cleanToken)) {
            return false;
        }

        return authenticator.verify({
            token: cleanToken,
            secret: secret,
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

/**
 * Generate backup codes (10 codes, 8 characters each)
 */
export function generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
        // Generate cryptographically random code
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(code);
    }
    return codes;
}

/**
 * Hash backup codes using bcrypt
 */
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
    const hashedCodes = await Promise.all(
        codes.map(code => bcrypt.hash(code, 10))
    );
    return hashedCodes;
}

/**
 * Verify backup code against hashed codes
 */
export async function verifyBackupCode(
    code: string,
    hashedCodes: string[]
): Promise<{ valid: boolean; index: number }> {
    for (let i = 0; i < hashedCodes.length; i++) {
        const isValid = await bcrypt.compare(code.toUpperCase(), hashedCodes[i]);
        if (isValid) {
            return { valid: true, index: i };
        }
    }
    return { valid: false, index: -1 };
}

/**
 * Generate device fingerprint
 */
export function generateDeviceFingerprint(userAgent: string, ip: string): string {
    const data = `${userAgent}:${ip}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Format secret for manual entry (groups of 4)
 */
export function formatSecretForDisplay(secret: string): string {
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
}
