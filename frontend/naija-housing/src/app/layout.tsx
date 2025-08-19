import '@/styles/globals.css';
import Navbar from '@/components/Navbar'
import {ReactNode} from 'react';
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'housing App',
  description: 'Find and post homes for rent or sale',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
