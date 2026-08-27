import { handleGoogleLogin, createPasswordForUser, loginWithEmailPassword, initGuestSession, logoutUser } from '../../services/auth.service.js';
import { prisma } from '../../prisma.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
};

export const authResolvers = {
    Mutation: {
        loginWithGoogle: async (_parent: any, args: { token: string, deviceInfo: any }, context: any) => {
            try {
                // Kết hợp deviceInfo từ Client gửi lên (Browser, OS) và từ Server tự soi (IP, UserAgent)
                const fullDeviceInfo = { ...args.deviceInfo, ...context.deviceInfo };
                
                const result = await handleGoogleLogin(args.token, fullDeviceInfo);

                // Quan trọng: Cài Refresh Token vào HttpOnly Cookie
                context.res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

                return { accessToken: result.accessToken, user: result.user };
            } catch (error: any) {
                throw new Error(`Đăng nhập Google thất bại: ${error.message}`);
            }
        },

        login: async (_parent: any, args: { email: string, password: string, deviceInfo: any }, context: any) => {
            try {
                const fullDeviceInfo = { ...args.deviceInfo, ...context.deviceInfo };
                
                // Gọi hàm login (lưu ý đổi biến args.password cho khớp logic của bạn)
                const result = await loginWithEmailPassword(args.email, args.password, fullDeviceInfo);

                // Quan trọng: Cài Refresh Token vào HttpOnly Cookie
                context.res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

                return { accessToken: result.accessToken, user: result.user };
            } catch (error: any) {
                throw new Error(`Đăng nhập thất bại: ${error.message}`);
            }
        },

        createPassword: async (_parent: any, args: { userId: string, plainPassword: string }) => {
            try {
                return await createPasswordForUser(args.userId, args.plainPassword);
            } catch (error: any) {
                throw new Error(`Tạo mật khẩu thất bại: ${error.message}`);
            }
        },

        initAppSession: async () => {
            const result = await initGuestSession();
            // Khách vãng lai: KHÔNG cài cookie, chỉ trả Access Token về RAM
            return { accessToken: result.accessToken, user: null };
        },

        logout: async (_parent: any, _args: any, context: any) => {
            const currentRefreshToken = context.currentRefreshToken;
            
            if (currentRefreshToken) {
                // Đẩy nhiệm vụ xử lý Database xuống tầng Service
                await logoutUser(currentRefreshToken);
            }

            // Resolver chỉ làm nhiệm vụ giao tiếp HTTP: Ra lệnh trình duyệt xóa Cookie
            context.res.clearCookie('refreshToken');
            return true;
        }
    }
};