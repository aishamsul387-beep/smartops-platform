import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { AuthSessionBootstrap } from '@/components/auth/AuthSessionBootstrap';

export const metadata: Metadata = {
  title: 'SmartOps WMS AI',
  description: 'Warehouse management system frontend foundation'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthSessionBootstrap />
        {children}
      </body>
    </html>
  );
}