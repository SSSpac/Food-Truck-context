'use client';
import Link from "next/link";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

export default function NavBar() {
  const { user, setUser } = useUserContext() as UserContextType;

  const handleLogOut = () => {
    setUser(null);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Food Trucker</Link>
        
        <div className="flex gap-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/categories" className="hover:text-gray-300">Categories</Link>
          {user && (
            <>
              <Link href="/profile" className="hover:text-gray-300">Profile</Link>
              <button onClick={handleLogOut} className="hover:text-gray-300">Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}