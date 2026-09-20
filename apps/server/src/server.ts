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
import { type MyJwtPayload } from '@aimsv2/shared/src/types/auth.js';

export interface MyContext {
    req: Request;
    res: Response;
    user: MyJwtPayload | null;
    deviceInfo: { userAgent: string; ip: string };
    currentRefreshToken?: string;
}

const PORT = process.env.PORT || 3000;

async function startServer() {
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

                const currentRefreshToken = req.cookies?.refreshToken;
                let user: MyJwtPayload | null = null;
                const authHeader = req.headers.authorization || '';
                 
                if (authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];
                    if (token) {
                        try {
                            // Ép kiểu chuẩn xác để báo cho TypeScript biết cấu trúc payload
                            user = jwt.verify(token, ENV.JWT_SECRET || 'super_secret_key') as MyJwtPayload;
                        } catch (error) {
                            // Im lặng bỏ qua lỗi token hết hạn/sai, user sẽ giữ giá trị null
                        }
                    }
                }

                return { req, res, user, deviceInfo, currentRefreshToken };
            },
        })
    );
    
    app.listen(PORT, () => {
        console.log(`Hybrid Server is running at http://localhost:${PORT}`);
        console.log(`GraphQL Endpoint: http://localhost:${PORT}/graphql`);
    });

    // Cronjob dọn dẹp Session hết hạn
    cron.schedule('0 0 * * *', async () => {
        try {
            const deleted = await prisma.session.deleteMany({
                where: { expired_at: { lt: new Date() } }
            });
            if (deleted.count > 0) console.log(`[Cron] Đã dọn dẹp ${deleted.count} session đã hết hạn.`);
        } catch (error) {
            console.error('[Cron] Lỗi khi dọn dẹp session:', error);
        }
    });
}

startServer().catch(console.error);