import { ENV } from '../config/env.js';
import { type GoogleJwtPayload } from '@aimsv2/shared/src/types/auth.js';
import { type IGoogleAuthService } from '../services/auth/auth.interface.js';

export class GoogleAuthService implements IGoogleAuthService {
    public async verifyToken(token: string): Promise<GoogleJwtPayload> {
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`
        );

        if (!response.ok) {
            throw new Error('Invalid Google Token');
        }

        const payload = (await response.json()) as GoogleJwtPayload;

        if (payload.aud !== ENV.GOOGLE_CLIENT_ID) {
            throw new Error('Google token audience mismatch');
        }

        return payload;
    }
}