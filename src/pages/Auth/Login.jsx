import React, {useState} from "react";
import Logo from "../../../src/assets/MindWorxLogo.png"

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import {supabase} from "../../utils/supabaseClient";

function Login() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            
            const { data, error } = await supabase.auth.signInWithOtp({email})
            if (error) {
                throw error
            }
            alert('Check your email for the login link!')
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className={"flex items-center justify-center min-h-screen bg-gray-100"}>
                <div className={"px-8 py-6 mt-4 text-left bg-white shadow-lg w-96"}>
                
                    {loading ? (
                        <div className={"flex flex-col place-items-center"}>
                            <h3 className={"text-2xl font-bold text-center"}>Sending magic link to email</h3>
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"/>
                            </div>
                        </div>
                    ) : (
                        <>  
                            <div>
                                <img src={Logo} alt="logo" className={"w-3/4 mx-auto pb-8"}/>
                                <h3 className={"text-2xl font-bold text-center"}>LOGIN</h3>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className={"mt-4"}>
                                    <div>
                                        <Input
                                            placeHolder={"Email"}
                                            type={"email"}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className={"flex flex-col place-items-center"}>
                                        <Button  text={"Login"}/>
                                        <a href="src/pages/Auth/Login#"
                                           className={"text-sm text-black-600 hover:underline mt-5 "}>Forgot
                                            password?</a>
                                        <div className="border-t-2 w-80 mt-5 ">
                                            <a href={"/Signup"} className={"text-sm text-black-600 hover:underline flex flex-col place-items-center mt-5 "}>Create
                                            an account today !</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </form>
                        </>
                    )}

                </div>
                
            </div>
        </>

    )
}

export default Login