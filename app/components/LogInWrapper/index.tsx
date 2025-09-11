'use client';
import LogInForm from '../LogInForm';
import {useUserContext, } from '@/utils/contexts';
import { UserContextType } from '@/utils/types';

const LogInWrapper = ({children}: {children: React.ReactNode}) => {
    const {user} = useUserContext() as UserContextType
    return (
        <>
{!user ? <LogInForm /> : children}
        </>
    )
}

export default LogInWrapper;