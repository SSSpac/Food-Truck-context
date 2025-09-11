'use client'
import {useUserContext} from "@/utils/contexts";
import {UserContextType} from "@/utils/types";
import Logo from '../../public/logo.png';
import Image from "next/image";
const Header = () => {

    const { user } = useUserContext() as UserContextType;
    return (
        <header className="bg-gray-800 text-white p-4">
            <img src="/food.png" alt="Food Trucker Logo" className="h-12 w-50px" />
            <h1 className="text-2xl font-bold">Food Trucker</h1>
        </header>
    );
}

export default Header;
