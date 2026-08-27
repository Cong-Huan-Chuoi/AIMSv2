export type GenderEnum = 'male' | 'female' | 'unknown';
export type SocialProvider = 'google' | 'facebook';

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
}

export interface SocialAccount {
  id: string;
  user_id: string;
  provider: SocialProvider;
  provider_account_id: string;
  created_at: Date | string;
  updated_at: Date | string;
}

