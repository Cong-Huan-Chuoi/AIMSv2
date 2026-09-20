import { 
    type InputCreatedUser, 
    type InputUpdateUser, 
    type User // Đảm bảo import User từ thư mục shared
} from "@aimsv2/shared";

export interface IAdminUserRepository {
    // Thay toàn bộ `any` bằng `User` để TypeScript có thể gợi ý code
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    createUser(createdUser: InputCreatedUser): Promise<User>;
    blockUser(id: string): Promise<User>; // Hoặc trả về boolean/void tuỳ logic DB của bạn
    unblockUser(id: string): Promise<User>;
    resetPasswordUser(id: string, password: string): Promise<User>;
    updateUser(id: string, updateInformation: InputUpdateUser): Promise<User>;
    deleteUser(id: string): Promise<User>;
}

export interface IAdminPasswordService {
    hash(plainPassword: string): Promise<string>;
}