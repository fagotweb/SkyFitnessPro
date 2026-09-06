import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'SkyFitnessPro',
  description: 'Онлайн-тренировки для занятий дома',
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body
        className={`${roboto.variable} font-sans antialiased bg-[#FAFAFA] h-full text-black`}
      >
        <AuthProvider>
        {children}
        {auth}
        </AuthProvider>
      </body>
    </html>
  );
}
