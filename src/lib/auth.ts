import jwt from 'jsonwebtoken';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string, refresh = false) {
  return jwt.verify(token, refresh ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!);
}
