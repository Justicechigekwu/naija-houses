import '@/styles/globals.css';
import Navbar from '@/components/Navbar'
import {ReactNode} from 'react';
import { AuthProvider } from '@/context/AuthContext'
import { SearchProvider } from '@/context/SearchContext';
import { UIProvider } from '@/context/UiContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppQueryProvider from '@/components/providers/QueryProvider';

export const metadata = {
  title: 'Velora Marketplace',
  description: 'Buy sell or rent anything from properties to vehicles to electronics and more.',
}

export default function RootLayout({ children }: { children: ReactNode }) {

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <AppQueryProvider>
              <AuthProvider>
                <NotificationProvider>
                    <SearchProvider>
                    <Navbar/>
                    <UIProvider>
                      {children}
                    </UIProvider>
                  </SearchProvider>
                </NotificationProvider>
              </AuthProvider>
            </AppQueryProvider>  
           </GoogleOAuthProvider>
        </ThemeProvider>    
      </body>
    </html>
  );
}


