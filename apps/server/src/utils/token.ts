import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.js';

/**
 * Sinh Access Token có thời hạn 30 phút.
 * @param userId - ID người dùng. Nếu là null, token được cấp cho Guest.
 * @param role - Vai trò mặc định là 'Customer'.
 */
export const generateAccessToken = (userId: string | null, role: string = 'Customer'): string => {
    return jwt.sign(
        { userId, role },
        ENV.JWT_SECRET || 'super_secret_key',
        { expiresIn: '30m' }
    );
};

/**
 * Sinh Refresh Token ngẫu nhiên không cần lưu trữ payload nội tại.
 * Sử dụng base64url để an toàn khi truyền qua HTTP Cookie.
 * Độ dài chuỗi trả về khoảng 86 ký tự, hoàn toàn vừa vặn với VARCHAR(128).
 */
export const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString('base64url');
};