import bcrypt from 'bcrypt';
import { type IAdminPasswordService } from '../services/admin/admin.interface.js';

export class AdminPasswordService implements IAdminPasswordService {
    private readonly saltRounds = 10;

    public async hash(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, this.saltRounds);
    }
}