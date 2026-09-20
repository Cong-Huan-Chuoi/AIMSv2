import { prisma } from '../prisma.js'; // Thay đổi đường dẫn cho đúng với dự án của bạn
import { type IAuthUserRepository } from '../services/auth/auth.interface.js';

export class PrismaUserRepository implements IAuthUserRepository {
    public async findByEmail(email: string): Promise<any | null> {
        return await prisma.users.findUnique({
            where: { email }
        });
    }

    public async findById(id: string): Promise<any | null> {
        return await prisma.users.findUnique({
            where: { id }
        });
    }

    public async updatePassword(id: string, passwordHash: string): Promise<any> {
        return await prisma.users.update({
            where: { id },
            data: { password_hash: passwordHash }
        });
    }

    public async findUserByGoogleId(googleId: string): Promise<any | null> {
        const socialAccount = await prisma.social_account.findFirst({
            where: {
                provider: 'google',
                provider_account_id: googleId
            },
            include: { users: true }
        });
        return socialAccount ? socialAccount.users : null;
    }

    public async createUserWithGoogle(profile: any, googleId: string): Promise<any> {
        return await prisma.$transaction(async (tx) => {
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
                    provider_account_id: googleId,
                }
            });

            return newUser;
        });
    }
}