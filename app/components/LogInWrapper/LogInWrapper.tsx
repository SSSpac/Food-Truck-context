'use client'
import LogInForm from '../LogInForm/LogInForm';
import { useUserContext } from '@/utils/contexts';
import { UserContextType } from '@/utils/types';

const LogInWrapper = ({ children }: { children: React.ReactNode }) => {
    const context = useUserContext();
    
    if (context === null) {
        return <div>Loading...</div>;
    }
    
    const { user } = context as UserContextType;
    
    return (
        <>
            {!user ? (
                <div className="min-h-screen bg-gray-100">
                    <LogInForm />
                </div>
            ) : (
                <div className="min-h-screen">
                    {children}
                </div>
            )}
        </>
    );
}

export default LogInWrapper;