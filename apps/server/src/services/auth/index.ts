import { AuthService } from './auth.service.js';
import { PrismaUserRepository } from '../../reprositories/prisma.user.repository.js';
import { PrismaSessionRepository } from '../../reprositories/prisma.session.repository.js';
import { JwtTokenService } from '../../utils/jwt.token.service.js';
import { BcryptPasswordService } from '../../utils/bcrypt.password.service.js';
import { GoogleAuthService } from '../../utils/google.auth.service.js';

// 1. Khởi tạo các class con
const userRepository = new PrismaUserRepository();
const sessionRepository = new PrismaSessionRepository();
const tokenService = new JwtTokenService();
const passwordService = new BcryptPasswordService();
const googleAuthService = new GoogleAuthService();

// 2. Bơm các class con vào AuthService
export const authService = new AuthService(
    userRepository,
    sessionRepository,
    tokenService,
    passwordService,
    googleAuthService
);