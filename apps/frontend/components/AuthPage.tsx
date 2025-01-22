"use client";
import { Button } from "@repo/ui/button";
export default function AuthPage({isSignIn} : {isSignIn:boolean}){
    
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="p-2 m-2 bg-white rounded">
                <input type="text" placeholder="email" className="border"/> <br /> <br />
                <input type="password" className="border"></input> <br /> <br />

                <Button text={isSignIn ? "SignIn" : "Signup"} variant="primary" className="px-4 py-2 bg-blue-600 rounded-lg"></Button>
                
            </div>
        </div>
    )
}