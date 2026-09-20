import { 
    type InputCreatedUser,
    type InputUpdateUser,
    type User
} from '@aimsv2/shared';
import {
    type IAdminUserRepository,
    type IAdminPasswordService
} from './admin.interface.js';

export class AdminService {
    constructor(
        private readonly adminUserRepository: IAdminUserRepository, // Sửa chữ P in hoa thành p thường
        private readonly adminpasswordService: IAdminPasswordService
    ) {}

    public async createUser(createdUser: InputCreatedUser): Promise<User> {
        const existingUser = await this.adminUserRepository.findByEmail(createdUser.email);
        if (existingUser) throw new Error("Email đã được dùng bởi một tài khoản khác.");
        
        createdUser.password = await this.adminpasswordService.hash(createdUser.password);
        return await this.adminUserRepository.createUser(createdUser);
    }

    public async blockUser(userID: string): Promise<User> {
        const user = await this.adminUserRepository.findById(userID);
        if (!user) throw new Error("Không tìm thấy tài khoản này.");
        
        // Kiểm tra xem status đã là true (bị khoá) chưa, nếu rồi thì không cần gọi DB nữa
        if (user.status === true) {
            throw new Error("Tài khoản này đã bị khoá từ trước.");
        }
        
        return await this.adminUserRepository.blockUser(userID);
    }

    public async unblockUser(userID: string): Promise<User> {
        const user = await this.adminUserRepository.findById(userID);
        if (!user) throw new Error("Không tìm thấy tài khoản này.");

        if (user.status === false){
            throw new Error("Tài khoản này vẫn đang activate.");
        }

        return await this.adminUserRepository.unblockUser(userID);
    }

    public async resetPasswordUser(userID: string, plainPassword: string): Promise<User> {
        const user = await this.adminUserRepository.findById(userID);
        if (!user) throw new Error("Không tìm thấy tài khoản này.");
        
        const hashedPassword = await this.adminpasswordService.hash(plainPassword);
        return await this.adminUserRepository.resetPasswordUser(userID, hashedPassword);
    }

    // ĐÃ HOÀN THIỆN GET USER PROFILE
    public async getUserProfile(userID: string): Promise<User> {
        const user = await this.adminUserRepository.findById(userID);
        if (!user) throw new Error("Không tìm thấy tài khoản này.");
        
        return user;
    }

    public async updateUserProfile(userID: string, updateInformation: InputUpdateUser): Promise<User> {
        const user = await this.adminUserRepository.findById(userID);
        if (!user) throw new Error("Không tìm thấy tài khoản này.");

        // Bổ sung: Nếu admin muốn đổi email của user, cần kiểm tra email đó đã tồn tại chưa
        if (updateInformation.email && updateInformation.email !== user.email) {
            const emailExists = await this.adminUserRepository.findByEmail(updateInformation.email);
            if (emailExists) throw new Error("Email mới muốn cập nhật đã bị sử dụng bởi tài khoản khác.");
        }

        return await this.adminUserRepository.updateUser(userID, updateInformation);
    }

    public async deleteUser(userID: string): Promise<User> {
        const user = await this.adminUserRepository.findById(userID);
        if (!user) throw new Error("Không tìm thấy tài khoản này để xóa.");

        
        return await this.adminUserRepository.deleteUser(userID);
    }
}