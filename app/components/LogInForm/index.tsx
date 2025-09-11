'use client'
import {UserArray} from "@/data/users";
import {useState} from "react";
import {useUserContext} from "@/utils/contexts";
import {UserContextType} from "@/utils/types";

const LogInForm = () => {
    const [userInput, setUserInput] = useState<string>('')
    const [userNotFound, setUserNotFound] = useState<boolean>(false)
    const {setUser} = useUserContext() as UserContextType;

    const handleClick = (e: {preventDefault: () => void}) => {
        e.preventDefault();

        const loggedInUser = UserArray.find(user => user.name === userInput) 
        
        if(!loggedInUser) {
            setUserNotFound(false);
        } else {
            setUserNotFound(true);
            setUser(loggedInUser);
        }
    }

    const handleChange = (event: {target: {value: string}}) => {
        setUserInput(event.target.value);
    }

    return (
        <div className="m-auto p-3 mt-4 border border-gray-500 rounded-lg shadow-lg">
            <form className="flex flex-col gap-8 text-center align-items-center">
                <h2>Please Log In</h2>
                <label htmlFor="username">Enter the username</label>
                <input onChange={handleChange} id="username" placeholder="Username" value={userInput}/>
                <label className="mb-8" htmlFor="password">Enter the password</label>
                <input id="password" type="password" placeholder="Password" />
                <button onClick={handleClick}>Log In</button>
            </form>
            {!userNotFound && <p>No user found with that username</p>}
        </div>
    )   
}

export default LogInForm;