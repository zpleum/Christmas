import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { query, queryOne } from './db';

// JWT secrets from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// User type
export interface User {
    id: string;
    email: string;
    name?: string;
    created_at: Date;
}

// JWT Payload
interface JWTPayload {
    userId: string;
    email: string;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate access token
 */
export function generateAccessToken(user: User): string {
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

/**
 * Generate refresh token with family ID for rotation
 */
export async function generateRefreshToken(userId: string, familyId?: string): Promise<{ token: string; familyId: string }> {
    const newFamilyId = familyId || randomUUID();

    const payload = {
        userId,
        familyId: newFamilyId,
        type: 'refresh',
    };

    const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Hash token before storing
    const tokenHash = await hashPassword(token);

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await query(
        `INSERT INTO refresh_tokens (user_id, token_hash, family_id, expires_at) 
     VALUES (?, ?, ?, ?)`,
        [userId, tokenHash, newFamilyId, expiresAt]
    );

    return { token, familyId: newFamilyId };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Verify refresh token and handle rotation
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: string; familyId: string } | null> {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;

        if (decoded.type !== 'refresh') {
            return null;
        }

        // Check if token exists in database and is not revoked
        const storedTokens = await query<any[]>(
            `SELECT * FROM refresh_tokens 
       WHERE user_id = ? AND family_id = ? AND is_revoked = FALSE AND expires_at > NOW()`,
            [decoded.userId, decoded.familyId]
        );

        if (storedTokens.length === 0) {
            // Token reuse detected! Invalidate all tokens in this family
            await revokeTokenFamily(decoded.familyId);
            throw new Error('Token reuse detected');
        }

        // Verify token hash matches one in database
        let tokenValid = false;
        for (const storedToken of storedTokens) {
            if (await comparePassword(token, storedToken.token_hash)) {
                tokenValid = true;
                // Revoke this specific token (single-use)
                await query(
                    `UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = ?`,
                    [storedToken.id]
                );
                break;
            }
        }

        if (!tokenValid) {
            // Token reuse detected!
            await revokeTokenFamily(decoded.familyId);
            throw new Error('Token reuse detected');
        }

        return {
            userId: decoded.userId,
            familyId: decoded.familyId,
        };
    } catch (error) {
        console.error('Refresh token verification error:', error);
        return null;
    }
}

/**
 * Revoke all tokens in a family (token theft detection)
 */
export async function revokeTokenFamily(familyId: string): Promise<void> {
    await query(
        `UPDATE refresh_tokens SET is_revoked = TRUE WHERE family_id = ?`,
        [familyId]
    );
}

/**
 * Revoke all tokens for a user (logout all devices)
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
    await query(
        `UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ?`,
        [userId]
    );
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
    return queryOne<User>(
        `SELECT id, email, name, created_at FROM users WHERE id = ?`,
        [userId]
    );
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
    return queryOne<User & { password_hash: string }>(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
}

/**
 * Create new user
 */
export async function createUser(email: string, password: string, name?: string): Promise<User> {
    const id = randomUUID();
    const passwordHash = await hashPassword(password);

    await query(
        `INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)`,
        [id, email, passwordHash, name]
    );

    return {
        id,
        email,
        name,
        created_at: new Date(),
    };
}
