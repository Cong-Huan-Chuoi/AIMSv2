import { prisma } from '../prisma.js'; // Import instance có sẵn của bạn
import { type InputCreatedUser, type InputUpdateUser, type User } from '@aimsv2/shared';
import { type IAdminUserRepository } from '../services/admin/admin.interface.js';

export class AdminUserRepository implements IAdminUserRepository {
    // =========================================
    // HELPER: Query Include để trả về cấu trúc chuẩn
    // =========================================
    private readonly userInclude = {
        roles: {
            include: {
                roles: true // Lấy chi tiết tên role (Admin, Customer...)
            }
        }
    };

    // =========================================
    // ĐỌC DỮ LIỆU
    // =========================================
    public async findByEmail(email: string): Promise<User | null> {
        return await prisma.users.findUnique({
            where: { email },
            include: this.userInclude
        }) as User | null;
    }

    public async findById(id: string): Promise<User | null> {
        return await prisma.users.findUnique({
            where: { id },
            include: this.userInclude
        }) as User | null;
    }

    // =========================================
    // GHI DỮ LIỆU CƠ BẢN
    // =========================================
    public async blockUser(id: string): Promise<User> {
        return await prisma.users.update({
            where: { id },
            data: { status: true }, // false = Bị khoá
            include: this.userInclude
        }) as User;
    }

    public async unblockUser(id: string): Promise<User> {
        return await prisma.users.update({
            where: { id },
            data: { status: false },
            include: this.userInclude
        }) as User;
    }

    public async resetPasswordUser(id: string, passwordHash: string): Promise<User> {
        return await prisma.users.update({
            where: { id },
            data: { password_hash: passwordHash },
            include: this.userInclude
        }) as User;
    }

    // =========================================
    // TẠO MỚI (Có check giới hạn 3 Admin)
    // =========================================
    public async createUser(createdUser: InputCreatedUser): Promise<User> {
        const { fullname, email, password, roles } = createdUser;

        return await prisma.$transaction(async (tx) => {
            // 1. Kiểm tra giới hạn 3 Admin nếu user mới có role Admin
            if (roles?.includes('Admin')) {
                const currentAdminCount = await tx.user_roles.count({
                    where: { roles: { name_role: 'Admin' } }
                });

                if (currentAdminCount >= 3) {
                    throw new Error("Hệ thống đã đạt giới hạn tối đa 3 Admin. Không thể tạo thêm.");
                }
            }

            // 2. Tạo User
            const newUser = await tx.users.create({
                data: {
                    fullname,
                    email,
                    password_hash: password, // Mật khẩu đã được hash từ Service
                }
            });

            // 3. Gán Role nếu có
            if (roles && roles.length > 0) {
                const rolesInDb = await tx.roles.findMany({
                    where: { name_role: { in: roles } }
                });

                if (rolesInDb.length !== roles.length) {
                    throw new Error("Một hoặc nhiều Role cung cấp không hợp lệ.");
                }

                await tx.user_roles.createMany({
                    data: rolesInDb.map(role => ({
                        user_id: newUser.id,
                        role_id: role.id
                    }))
                });
            }

            // 4. Trả về kết quả hoàn chỉnh
            return await tx.users.findUniqueOrThrow({
                where: { id: newUser.id },
                include: this.userInclude
            }) as User;
        });
    }

    // =========================================
    // CẬP NHẬT (Có check giới hạn 3 Admin)
    // =========================================
    public async updateUser(id: string, updateInformation: InputUpdateUser): Promise<User> {
        const { roles, ...scalarData } = updateInformation;

        return await prisma.$transaction(async (tx) => {
            // Nếu có cập nhật danh sách role
            if (roles) {
                const wantsToBeAdmin = roles.includes('Admin');

                // Lấy danh sách role hiện tại của user này
                const currentUserRoles = await tx.user_roles.findMany({
                    where: { user_id: id },
                    include: { roles: true }
                });
                const isCurrentlyAdmin = currentUserRoles.some(ur => ur.roles.name_role === 'Admin');

                // 1. Check giới hạn 3 Admin
                if (wantsToBeAdmin && !isCurrentlyAdmin) {
                    const currentAdminCount = await tx.user_roles.count({
                        where: { roles: { name_role: 'Admin' } }
                    });

                    if (currentAdminCount >= 3) {
                        throw new Error("Hệ thống đã đạt giới hạn tối đa 3 Admin. Không thể thăng cấp user này thành Admin.");
                    }
                }

                // 2. Cập nhật Role (Xoá role cũ, nạp role mới)
                const rolesInDb = await tx.roles.findMany({
                    where: { name_role: { in: roles } }
                });

                if (rolesInDb.length !== roles.length) {
                    throw new Error("Một hoặc nhiều Role cung cấp không hợp lệ.");
                }

                // Xoá tất cả role cũ
                await tx.user_roles.deleteMany({
                    where: { user_id: id }
                });

                // Thêm role mới
                if (rolesInDb.length > 0) {
                    await tx.user_roles.createMany({
                        data: rolesInDb.map(role => ({
                            user_id: id,
                            role_id: role.id
                        }))
                    });
                }
            }

            // 3. Cập nhật thông tin cá nhân (xoá các undefined field)
            const validData = Object.fromEntries(
                Object.entries(scalarData).filter(([_, v]) => v !== undefined)
            );

            return await tx.users.update({
                where: { id },
                data: validData,
                include: this.userInclude
            }) as User;
        });
    }

    // =========================================
    // XÓA DỮ LIỆU
    // =========================================
    public async deleteUser(id: string): Promise<User> {
        return await prisma.$transaction(async (tx) => {
            // 1. Lấy thông tin user trước khi xóa để trả về (nếu cần)
            const userToDelete = await tx.users.findUnique({
                where: { id },
                include: this.userInclude
            });

            if (!userToDelete) {
                throw new Error("Không tìm thấy tài khoản cần xóa.");
            }

            // 2. Xóa các bản ghi liên quan trong bảng trung gian user_roles
            await tx.user_roles.deleteMany({
                where: { user_id: id }
            });

            // 3. Xóa user chính
            await tx.users.delete({
                where: { id }
            });

            // Trả về thông tin user đã bị xóa
            return userToDelete as User;
        });
    }
}