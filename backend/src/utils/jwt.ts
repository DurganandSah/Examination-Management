import jwt, { JwtPayload as SignJwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface DecodedToken extends SignJwtPayload, TokenPayload {}

/**
 * Generates a signed JWT token with user payload and configured expiration.
 * @param payload User identity information
 * @param expiresIn Optional override for token expiration duration
 */
export const generateToken = (payload: TokenPayload, expiresIn?: string): string => {
  const options: SignOptions = {
    expiresIn: (expiresIn || config.jwtExpiresIn) as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwtSecret, options);
};

/**
 * Verifies and decodes a JWT token.
 * @param token Raw JWT token string
 * @returns Decoded TokenPayload
 */
export const verifyToken = (token: string): DecodedToken => {
  return jwt.verify(token, config.jwtSecret) as DecodedToken;
};
