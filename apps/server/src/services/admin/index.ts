import { AdminService } from "./admin.service.js";
import { AdminUserRepository } from "../../reprositories/prisma.admin.repository.js";
import { AdminPasswordService } from "../../utils/admin.password.service.js";

const adminUserRepository = new AdminUserRepository();
const adminPasswordService = new AdminPasswordService();

export const adminService = new AdminService(
    adminUserRepository,
    adminPasswordService
)