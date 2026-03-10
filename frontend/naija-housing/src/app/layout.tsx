import '@/styles/globals.css';
import Navbar from '@/components/Navbar'
import {ReactNode} from 'react';
import { AuthProvider } from '@/context/AuthContext'
import { SearchProvider } from '@/context/SearchContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { UIProvider } from '@/context/UiContext';

export const metadata = {
  title: 'housing App',
  description: 'Find and post homes for rent or sale',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminAuthProvider>
            <SearchProvider>
            <Navbar/>
            <UIProvider>
              {children}
            </UIProvider>
          </SearchProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
