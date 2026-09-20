import { type MyContext } from '../server.js';
import { type RoleEnum } from '@aimsv2/shared';

export const requireRoles = (
    allowedRoles: RoleEnum[], 
    requireLogin: boolean = true, // Mặc định là bắt buộc đăng nhập
    resolverFunc: Function
) => {
    return async (parent: any, args: any, context: MyContext, info: any) => {
        // 1. Nếu client hoàn toàn không có token gửi lên -> chặn
        if (!context.user) {
            throw new Error("UNAUTHENTICATED: Không tìm thấy Access Token.");
        }

        // 2. Nếu API yêu cầu phải đăng nhập thật, nhưng userId lại là null -> chặn
        if (requireLogin && !context.user.userId) {
            throw new Error("UNAUTHENTICATED: Yêu cầu đăng nhập tài khoản.");
        }

        // 3. Kiểm tra xem user có quyền không
        const hasPermission = context.user.roles.some(role => allowedRoles.includes(role));
        
        if (!hasPermission) {
            throw new Error(`FORBIDDEN: Yêu cầu quyền: ${allowedRoles.join(', ')}.`);
        }

        // 4. Hợp lệ -> Chạy logic resolver
        return resolverFunc(parent, args, context, info);
    };
};