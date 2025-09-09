'use client';

import { useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setmessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setmessage('');
        setLoading(true);

        try {
            const res = await api.post('/reset/forgot-password/', { email });
            setmessage(res.data.message || 'Reset link sent to your email.');
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
           <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
           <form onSubmit={handleSubmit} className="flex flex-col gap">
             <input
               type="email"
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className="border p-2 rounded"
             />
             <button
                type='submit'
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {loading ? 'Sending...' : 'Send Reset Link'}
             </button>
           </form>
           {message && <p className="text-green-500 mt-2">{message}</p>}
           {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}