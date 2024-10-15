export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl: string;
}

export const defaultTheme: Theme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#1D4ED8',
  backgroundColor: '#F3F4F6',
  textColor: '#111827',
  logoUrl: '/default-logo.png',
};