'use client'
import {createContext , useContext, useState, useEffect} from 'react';
import {UserContextType, UserType} from './types';

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<UserType | null>(null)

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
    <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext)
}