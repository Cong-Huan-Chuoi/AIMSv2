import app from './app.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './graphql/typeDefs/index.js';
import { resolvers } from './graphql/resolvers/index.js';

import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import { ENV } from './config/env.js';
import { prisma } from './prisma.js';

import type { Request, Response } from 'express';

// 1. Định nghĩa Type rõ ràng cho Context để TypeScript không báo lỗi "BaseContext"
export interface MyContext {
    req: Request;
    res: Response;
    user: string | jwt.JwtPayload | null;
    deviceInfo: { userAgent: string; ip: string };
    currentRefreshToken?: string;
}

const PORT = process.env.PORT || 3000;

async function startServer() {
    // 2. Truyền MyContext vào ApolloServer
    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
    });
    await server.start();

    app.use(cookieParser());

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req, res }): Promise<MyContext> => {
                const deviceInfo = {
                    userAgent: req.headers['user-agent'] || 'Unknown',
                    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown'
                };

                // Lấy cookie (dùng optional chaining ?. để tránh lỗi nếu req.cookies chưa parse kịp)
                const currentRefreshToken = req.cookies?.refreshToken;

                let user = null;
                const authHeader = req.headers.authorization || '';
                 
                // 3. Sửa 'Bearer' thành 'Bearer ' (có dấu cách)
                if (authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];

                    if (token){
                        try{
                            user = jwt.verify(token, ENV.JWT_SECRET || 'super_secret_key');
                        } catch(error){}
                    }
                }

                // 4. Đưa lệnh return RA NGOÀI khối if
                return { req, res, user, deviceInfo, currentRefreshToken };
            },
        })
    );
    
    app.listen(PORT, () => {
        // 5. Đổi dấu nháy đơn thành backtick (`) để nội suy biến ${PORT}
        console.log(`Hybrid Ser is running at http://localhost:${PORT}`);
        console.log(`GraphQL Endpoint: http://localhost:${PORT}/graphql`);
    });

    // cron.schedule('0 0 * * *', async () => {
    //     try {
    //         const deleted = await prisma.session.deleteMany({
    //             where: {
    //                 user_id: null,
    //                 expired_at: { lt: new Date() } // Thời gian hết hạn nhỏ hơn hiện tại
    //             }
    //         });
    //         if (deleted.count > 0) {
    //             console.log(`[Cron] Đã dọn dẹp ${deleted.count} session rác của Guest.`);
    //         }
    //     } catch (error) {
    //         console.error('[Cron] Lỗi khi dọn dẹp session:', error);
    //     }
    // });
    cron.schedule('0 0 * * *', async () => {
        try {
            const deleted = await prisma.session.deleteMany({
                where: {
                    // Xóa hẳn dòng user_id: null đi
                    expired_at: { lt: new Date() } // Xóa MỌI session đã quá hạn 30 ngày
                }
            });
            if (deleted.count > 0) {
                console.log(`[Cron] Đã dọn dẹp ${deleted.count} session đã hết hạn.`);
            }
        } catch (error) {
            console.error('[Cron] Lỗi khi dọn dẹp session:', error);
        }
    });
}

startServer().catch((error) => {
    console.error("Lỗi khi khởi động server:", error);
});