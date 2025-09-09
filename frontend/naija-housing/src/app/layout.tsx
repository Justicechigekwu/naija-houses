import '@/styles/globals.css';
import Navbar from '@/components/Navbar'
import {ReactNode} from 'react';
import { AuthProvider } from '@/context/AuthContext'
import { SearchProvider } from '@/context/SearchContext';

export const metadata = {
  title: 'housing App',
  description: 'Find and post homes for rent or sale',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SearchProvider>
            <Navbar/>
            {children}
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
