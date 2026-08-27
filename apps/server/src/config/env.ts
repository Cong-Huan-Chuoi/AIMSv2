export const ENV = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '', // Lấy từ Google Cloud Console
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '7d'
};