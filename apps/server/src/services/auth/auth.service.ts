import { type DeviceInfo } from '@aimsv2/shared/src/types/auth.js';
import { 
    type IAuthUserRepository, 
    type ISessionRepository, 
    type ITokenService, 
    type IAuthPasswordService, 
    type IGoogleAuthService 
} from './auth.interface.js';


export class AuthService {
    // Dependency Injection qua Constructor
    constructor(
        private readonly authUserRepository: IAuthUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly tokenService: ITokenService,
        private readonly passwordService: IAuthPasswordService,
        private readonly googleAuthService: IGoogleAuthService
    ) {}

    public async initGuestSession() {
        const accessToken = this.tokenService.generateAccessToken(null);
        return { accessToken };
    }

    public async logoutUser(refreshToken: string) {
        await this.sessionRepository.deleteSessionByRefreshToken(refreshToken);
    }

    public async handleGoogleLogin(token: string, deviceInfo: DeviceInfo) {
        // 1. Xác thực Google (Không cần biết thư viện google-auth-library hoạt động ra sao)
        const profile = await this.googleAuthService.verifyToken(token);
        const providerAccountId = profile.sub;

        // 2. Tương tác DB qua Repository
        let user = await this.authUserRepository.findUserByGoogleId(providerAccountId);
        if (!user) {
            user = await this.authUserRepository.createUserWithGoogle(profile, providerAccountId);
        }

        // 3. Sinh token
        const accessToken = this.tokenService.generateAccessToken(user.id);
        const refreshToken = this.tokenService.generateRefreshToken();

        // 4. Lưu session
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 30);
        await this.sessionRepository.createSession(user.id, refreshToken, deviceInfo, expiredAt);

        return { accessToken, refreshToken, user: { ...user, role: 'Customer' } };
    }

    public async loginWithEmailPassword(email: string, plainPassword: string, deviceInfo: DeviceInfo) {
        // 1. Tìm user
        const user = await this.authUserRepository.findByEmail(email);
        if (!user) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
        if (!user.password_hash) throw new Error('Tài khoản chưa có mật khẩu, vui lòng đăng nhập qua Google.');

        // 2. So sánh mật khẩu (Không cần biết bcrypt hay argon2)
        const isPasswordValid = await this.passwordService.compare(plainPassword, user.password_hash);
        if (!isPasswordValid) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');

        // 3. Sinh token và lưu session
        const accessToken = this.tokenService.generateAccessToken(user.id);
        const refreshToken = this.tokenService.generateRefreshToken();
        
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 30);
        await this.sessionRepository.createSession(user.id, refreshToken, deviceInfo, expiredAt);

        return { accessToken, refreshToken, user: { ...user, role: 'Customer' } };
    }

    public async createPasswordForUser(userId: string, plainPassword: string) {
        const passwordHash = await this.passwordService.hash(plainPassword);
        return await this.authUserRepository.updatePassword(userId, passwordHash);
    }
}