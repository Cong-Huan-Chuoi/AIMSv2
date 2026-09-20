import type { User } from './user.js';
import type { RoleEnum } from './user.js';
export interface GoogleJwtPayload {
    aud: string //client id cua app
    sub: string //id dinh danh duy nhat cua nguoi dung google
    email?: string;
    name?: string;
    picture?: string;
    [key: string]: any;
}

export interface DeviceInfo {
    userAgent?: string;
    ip?: string;
    browser?: string;
    os?: string;
    deviceType?: string;
}

export interface AuthPayload {
    accessToken: string;
    user: User | null; // Cực kỳ quan trọng: Cho phép null nếu là Guest Session
}

export interface MyJwtPayload {
    userId: string | null;
    roles: RoleEnum[]; 
}