'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';
import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { query, setQuery, searchListings, results } = useSearch();
  const router = useRouter();
  const { user, token } = useAuth(); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  const   API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

  const handleSellClick = () => {
    if (!token) {
      router.push('/login?redirect=/listings/create'); 
    } else {
      router.push('/listings/create');
    }
  };
  
  useEffect(() => {
    if (query.trim()) {
      const delayDebounce = setTimeout(() => {
        searchListings();
        setShowSuggestions(true);
      }, 400);
      return () => clearTimeout(delayDebounce);
    } else {
      setShowSuggestions(false);
    }
  }, [query, searchListings]);

  const handleSelect = (id: string) => {
    setShowSuggestions(false);
    setQuery('');
    router.push(`/listings/${id}`)
  }

  return (
    <nav className="bg-white shadow p-4 flex  justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Housing App
      </Link>

      <div className='flex-1 mx-4 flex relative'>
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='What are you looking for?'
          className='w-full border px-3 py-2 rounded-md'
          onFocus={() => setShowSuggestions(true)} 
        />

        {showSuggestions && (
          <div className='absolute top-full mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-50'>
            {results.length > 0 ? (
              results.map((item: any) => (
                <div
                key={item._id}
                onClick={() => handleSelect(item._id)}
                className='flex items-center gap-3 p-2 curso-pointer hover:bg-gray-100'
                >
                  <img
                    src={item.images?.[0] ? `${API_BASE}${item.images[0]}` : "/placeholder.jpg"}
                    alt={item.title}
                    className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.location}, {item.state}</p>
                    </div>
                </div>
              ))
            ) : (
              <p className='p-3 text-sm text-gray-500'>No results found..  Perhaps you can double check yours spellings</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">

        <button
          onClick={handleSellClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sell
        </button>

        {token && (
          <Link href="/messages" 
          className='relative hover:text-green-600'>
            <MessageSquare className='w-6 h-6' />
          </Link>
        )}

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
                  src={`${API_BASE}${user.avatar}`}
                  alt='avatar'
                  className='w-8 h-8 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-gray-300'></div>
                )}
                <span className='text-gray-700'>Hi, {user?.firstName || "User"}</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
