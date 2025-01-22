"use client";

import AuthPage from "@/components/AuthPage";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/Config";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function page(){
    const [input, setInput] = useState({
                email: '',
                password: '',
              });
    const router = useRouter();
    const handleInputChange = (e:ChangeEvent<HTMLInputElement>)=>{
                setInput((inp)=>(
                    {...inp, [e.target.name] : e.target.value}
                ))
        }
    
        const handleSubmit = async(e:FormEvent)=>{
            e.preventDefault();
            
            try {
                const res = await axios.post(`${HTTP_BACKEND}/signup`, input);
                if(res?.data?.success){
                    toast.success(res?.data?.message, {
                        duration : 5000
                    })
                    router.push('/signin');
                }
            } catch (error) {
                if(axios.isAxiosError(error)){
                    toast.error(error?.response?.data?.message);
                }
                else{
                    toast.error("Something went wrong.");
                }
                console.log(error);
            
            }
            
        }
    return (
        <AuthPage input={input} handleChange={handleInputChange} handleSubmit={handleSubmit} isSignIn={false}/>
    )
}