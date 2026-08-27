import { PrismaClient } from '../generated/prisma/index.js';

// Khởi tạo một instance duy nhất của Prisma
export const prisma = new PrismaClient();