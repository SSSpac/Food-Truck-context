'use client'
import {UserArray} from "@/data/users";
import {useState} from "react";
import {useUserContext} from "@/utils/contexts";
import {UserContextType} from "@/utils/types";

const LogInForm = () => {
    const [userInput, setUserInput] = useState<string>('')
    const [passwordInput, setPasswordInput] = useState<string>('')
    const [userNotFound, setUserNotFound] = useState<boolean>(false)
    const {setUser} = useUserContext() as UserContextType;

    const handleClick = (e: {preventDefault: () => void}) => {
        e.preventDefault();

        const loggedInUser = UserArray.find(user => user.name === userInput) 
        
        if(!loggedInUser) {
            setUserNotFound(true);
        } else {
            setUserNotFound(false);
            setUser(loggedInUser);
        }
    }

    const handleUsernameChange = (event: {target: {value: string}}) => {
        setUserInput(event.target.value);
    }

    const handlePasswordChange = (event: {target: {value: string}}) => {
        setPasswordInput(event.target.value);
    }

    return (
        <div className="m-5 p-3  border border-black rounded-lg shadow-lg pt-10">
            <form className="bg-blue-400 flex flex-col gap-10 text-center align-items-center">
                <h2 className="text-black text-black text-bold">Please Log In First</h2>
                <label htmlFor="username" className="text-black ">Enter the username "Bobbe" or "Tobbe"</label>
                <input onChange={handleUsernameChange} id="username" placeholder="Username" value={userInput}className="border"/>
                <label className="mb-8 text-align-center text-black" htmlFor="password">Enter the password "1"</label>
                <input 
                    onChange={handlePasswordChange} 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    value={passwordInput}
                    className="border "
                />
                <button onClick={handleClick} className="bg-black text-white rounded p-2">Log In</button>
            </form>
            {userNotFound && <p>No user found with that username</p>}
        </div>
    )   
}

export default LogInForm;