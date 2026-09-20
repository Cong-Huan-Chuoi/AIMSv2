export type GenderEnum = 'male' | 'female' | 'unknown';
export type SocialProvider = 'google' | 'facebook';
export type RoleEnum = 'Admin' | 'Product_Manager' | 'Customer';

export interface User {
  id: string;
  fullname: string;
  email?: string | null;
  avatar_url?: string | null;
  date_of_birth?: Date | string | null;
  phone_num?: string | null;
  gender?: GenderEnum | null;
  status: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  roles?: UserRole[];
}

export interface SocialAccount {
  id: string;
  user_id: string;
  provider: SocialProvider;
  provider_account_id: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Role{
    id: string;
    name_role: RoleEnum;
    role_num?: number | null;
}

export interface UserRole{
    user_id: string;
    role_id: string;
    roles: Role;
}

export interface InputCreatedUser{
  fullname: string;
  email: string;
  password: string;
  roles?: RoleEnum[];
}

export interface InputUpdateUser{
  fullname?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  date_of_birth?: Date | string | null;
  phone_num?: string | null;
  gender?: GenderEnum | null;
  roles?: RoleEnum[];
}