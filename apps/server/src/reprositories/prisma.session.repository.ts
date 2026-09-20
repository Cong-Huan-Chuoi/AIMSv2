import { prisma } from '../prisma.js';
import { type ISessionRepository } from '../services/auth/auth.interface.js';
import { type DeviceInfo } from '@aimsv2/shared/src/types/auth.js';

export class PrismaSessionRepository implements ISessionRepository {
    public async createSession(userId: string, refreshToken: string, deviceInfo: DeviceInfo, expiredAt: Date): Promise<void> {
        await prisma.session.create({
            data: {
                user_id: userId,
                refresh_token: refreshToken,
                device_info: JSON.stringify(deviceInfo),
                expired_at: expiredAt
            }
        });
    }

    public async deleteSessionByRefreshToken(refreshToken: string): Promise<void> {
        await prisma.session.deleteMany({
            where: { refresh_token: refreshToken }
        });
    }
}