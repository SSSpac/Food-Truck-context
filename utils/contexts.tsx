'use client'
import {createContext , useContext, useState} from 'react';
import {UserContextType, UserType} from './types';

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<UserType | null>(null)

    return (
    <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>

    )

}
export const useUserContext = () => {
    return useContext(UserContext)
}