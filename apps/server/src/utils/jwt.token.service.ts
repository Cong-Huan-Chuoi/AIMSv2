import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { type RoleEnum } from '@aimsv2/shared';
import { type ITokenService } from '../services/auth/auth.interface.js';

export class JwtTokenService implements ITokenService {
    /**
     * Sinh Access Token có thời hạn 30 phút.
     * @param userId - ID người dùng. Nếu là null, token được cấp cho Guest.
     * @param roles - Vai trò mặc định là ['Customer'].
     */
    public generateAccessToken(userId: string | null = null, roles: RoleEnum[] = ['Customer']): string {
        return jwt.sign(
            { userId, roles },
            ENV.JWT_SECRET || 'super_secret_key',
            { expiresIn: '30m' }
        );
    }

    /**
     * Sinh Refresh Token ngẫu nhiên không cần lưu trữ payload nội tại.
     * Sử dụng base64url để an toàn khi truyền qua HTTP Cookie.
     * Độ dài chuỗi trả về khoảng 86 ký tự, hoàn toàn vừa vặn với VARCHAR(128).
     */
    public generateRefreshToken(): string {
        return crypto.randomBytes(64).toString('base64url');
    }
}