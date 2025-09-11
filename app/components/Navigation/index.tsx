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
        <nav className="bg-blue-400 p-4 text-white flex justify-between">
            <div className="flex space-x-4">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/categories" className="hover:underline">Categories</Link>
                <Link href="/profile" className="hover:underline">Profile</Link>
                
                {user && (
                    <button onClick={handleLogout} className="hover:underline">
                        Logout ({user.name})
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navigation;