'use client'
import Link from "next/link";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const Navigation = () => {
    const { user, setUser } = useUserContext() as UserContextType;

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <nav className="bg-blue-500 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-6">
                    <Link href="/" className="hover:underline font-medium">Home</Link>
                    <Link href="/categories" className="hover:underline font-medium">Categories</Link>
                    <Link href="/profile" className="hover:underline font-medium">Profile</Link>
                </div>

                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Welcome, {user.name}!</span>
                        <button 
                            onClick={handleLogout} 
                            className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100 transition text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;