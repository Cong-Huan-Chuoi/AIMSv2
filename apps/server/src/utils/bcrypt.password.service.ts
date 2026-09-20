import bcrypt from 'bcrypt'; // Hoặc thư viện bạn đang dùng (argon2, bcryptjs...)
import { type IAuthPasswordService } from '../services/auth/auth.interface.js';

export class BcryptPasswordService implements IAuthPasswordService {
    private readonly SALT_ROUNDS = 10;

    public async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    public async compare(plain: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plain, hash);
    }
}