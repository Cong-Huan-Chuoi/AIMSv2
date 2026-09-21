import { ProductManagerService } from './pm.service.js';
import { PrismaPMRepository } from '../../reprositories/prisma.pm.repository.js';

// Khởi tạo Repository
const pmRepository = new PrismaPMRepository();

// Inject (Tiêm) Repository vào trong Service
export const PMService = new ProductManagerService(pmRepository);

// Export thêm Interface nếu có file khác cần dùng tới kiểu
export * from './pm.interface.js';