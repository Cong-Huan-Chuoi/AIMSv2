import { prisma } from '../prisma.js';
import { verifyGoogleToken } from '../utils/googleAuth.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { type DeviceInfo } from '@aimsv2/shared/src/types/auth.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const initGuestSession = async () => {
    // Chỉ cấp vé tạm (Access Token) không có user_id
    const accessToken = generateAccessToken(null, 'Customer');
    
    return { accessToken };
};

export const logoutUser = async (refreshToken: string) => {
    // Tương tác với Database ở tầng Service
    await prisma.session.deleteMany({
        where: { refresh_token: refreshToken }
    });
};

export const handleGoogleLogin = async (token: string, deviceInfo: DeviceInfo) => {
    // Giải mã token để lấy thông tin
    const profile = await verifyGoogleToken(token);
    const providerAccountId = profile.sub;

    const existingSocial = await prisma.social_account.findFirst({
        where: {
            provider: 'google',
            provider_account_id: providerAccountId
        },
        include: { users: true }
    });

    let user;

    if (existingSocial) {
        user = existingSocial.users;
    } else {
        user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.users.create({
                data: {
                    fullname: profile.name || 'Unknown User',
                    email: profile.email || null,
                    avatar_url: profile.picture || null,
                }
            });

            await tx.social_account.create({
                data: {
                    user_id: newUser.id,
                    provider: 'google',
                    provider_account_id: providerAccountId,
                }
            });
            return newUser;
        });
    }

    // Cấp phát token và lưu Session cho user đăng nhập qua Google
    const accessToken = generateAccessToken(user.id, 'Customer');
    const refreshToken = generateRefreshToken();

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 30);

    await prisma.session.create({
        data: {
            user_id: user.id,
            refresh_token: refreshToken,
            device_info: JSON.stringify(deviceInfo),
            expired_at: expiredAt
        }
    });

    return { 
        accessToken, 
        refreshToken, 
        user: { ...user, role: 'Customer' } 
    };
}

export const createPasswordForUser = async (userId: string, plainPassword: string) => {
    const passwordHash = await hashPassword(plainPassword);

    const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: { password_hash: passwordHash }
    });

    return updatedUser;
}

export const loginWithEmailPassword = async (email: string, plainPassword: string, deviceInfo: DeviceInfo) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email // Sửa lỗi gọi chuỗi 'email' cứng
        }
    });

    if (!user) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    if (!user.password_hash) {
        throw new Error('Tài khoản chưa có mật khẩu, vui lòng đăng nhập qua Google và cập nhật.');
    }

    // Đã bổ sung await để hàm so sánh hoạt động đúng kết quả
    const isPasswordValid = await comparePassword(plainPassword, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    const accessToken = generateAccessToken(user.id, 'Customer');
    const refreshToken = generateRefreshToken();

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 30);

    // LUÔN TẠO PHIÊN MỚI (Hỗ trợ 1 user đăng nhập nhiều thiết bị cùng lúc)
    await prisma.session.create({
        data: {
            user_id: user.id,
            refresh_token: refreshToken,
            device_info: JSON.stringify(deviceInfo),
            expired_at: expiredAt
        }
    });

    return { 
        accessToken, 
        refreshToken, 
        user: { ...user, role: 'Customer' } 
    };
}