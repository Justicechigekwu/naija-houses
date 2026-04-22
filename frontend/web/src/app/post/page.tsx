'use client'; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PostPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect( () => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user]);

    if (!user) return <p className="p-6">Redirecting...</p>;

    return (
        <main className="p-6">
            <h1 className="text-2x1 font-bold">Post a property</h1>
            <p>Post form will go here</p>
        </main>
    )
}