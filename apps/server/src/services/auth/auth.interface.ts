import { type DeviceInfo } from '@aimsv2/shared/src/types/auth.js';
import { type RoleEnum } from '@aimsv2/shared';
// 1. Giao tiếp với Database (User)
export interface IAuthUserRepository {
    findByEmail(email: string): Promise<any | null>;
    findById(id: string): Promise<any | null>;
    updatePassword(id: string, passwordHash: string): Promise<any>;
    findUserByGoogleId(googleId: string): Promise<any | null>;
    createUserWithGoogle(profile: any, googleId: string): Promise<any>;
}

// 2. Giao tiếp với Database (Session)
export interface ISessionRepository {
    createSession(userId: string, refreshToken: string, deviceInfo: DeviceInfo, expiredAt: Date): Promise<void>;
    deleteSessionByRefreshToken(refreshToken: string): Promise<void>;
}

// 3. Xử lý Token (JWT)
export interface ITokenService {
    generateAccessToken(userId: string | null, roles?: RoleEnum[]): string;
    generateRefreshToken(): string;
}

// 4. Xử lý Password
export interface IAuthPasswordService {
    hash(password: string): Promise<string>;
    compare(plain: string, hash: string): Promise<boolean>;
}

// 5. Xử lý bên thứ 3 (Google)
export interface IGoogleAuthService {
    verifyToken(token: string): Promise<any>;
}