'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, token, logout } = useAuth(); 

  const handleSellClick = () => {
    if (!token) {
      router.push('/login?redirect=/listings/create'); 
    } else {
      router.push('/listings/create');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/')
  }

  return (
    <nav className="bg-white shadow p-4 flex  justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Housing App
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:text-green-600">Home</Link>

        <button
          onClick={handleSellClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sell
        </button>

        {!token ? (
          <>
            <Link href="/login" className="hover:text-green-600">Login</Link>
            <Link href="/register" className="hover:text-green-600">Register</Link>
          </>
        ) : (
          <>
            <Link href="/profile" className='flex items-center gap-3 hover:opacity-80'>
              <div className='flex items-center gap-3'>
                {user?.avatar ? (
                  <img
                  src={user.avatar}
                  alt='avatar'
                  className='w-8 h-8 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-gray-300'></div>
                )}
                <span className='text-gray-700'>Hi, {user?.name || "User"}</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
