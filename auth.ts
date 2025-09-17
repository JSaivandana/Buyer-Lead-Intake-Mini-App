// src/lib/auth.ts
import { sign, verify } from 'jsonwebtoken';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { NextRequest } from 'next/server';

const SECRET = process.env.APP_JWT_SECRET || 'dev-secret';
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'buyer_app_session';

export function createDemoSession(res: Response, user: { id: string; name?: string; email?: string }) {
    const token = sign(user, SECRET, { expiresIn: '7d' });
    const cookie = serializeCookie(COOKIE_NAME, token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    res.headers.append('Set-Cookie', cookie);
}

// Parse token from Request object (App Router Request)
export function getSessionFromRequest(req: Request) {
    const cookieHeader = req.headers.get('cookie') || '';
    const parsed: Record<string,string> = Object.fromEntries(cookieHeader.split(';').map(s => s.trim().split('=')));
    const token = parsed[COOKIE_NAME];
    if (!token) return null;
    try {
        return verify(token, SECRET) as { id: string; name?: string; email?: string; iat?: number; exp?: number };
    } catch (err) {
        return null;
    }
}
