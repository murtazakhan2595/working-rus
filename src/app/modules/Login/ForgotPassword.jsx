import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import oops from "../.././../assets/images/oops.jpg";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "./../../../src/@/components/ui/label";
import NewLogo from "../.././../assets/images/NewLogo"
import { StepBack  } from 'lucide-react';
import { Link } from 'react-router-dom';



const ForgotPassword = () => {
    const baseUrl = useSelector((state) => state.user.baseUrl);
    const initialData = { email: "" };

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(`${baseUrl}/password/reset/`, formData);
            if (res.status === 200) {
                setResponse({ message: res.data.success, status: "success" });
            }
        } catch (error) {
            setResponse({ message: error.response?.data?.error || "Can’t find your email?", status: "error" });
        } finally {
            setIsLoading(false);
            setFormData(initialData);
        }
    };

    return (
        <>
<div className="container max-w-full mx-auto ">
      <div className="absolute top-3 right-3">
      <Button >
            
            <Link className="flex items-center" to="/"><StepBack  className="w-4 h-4 mr-2" /> Go back</Link> 
         </Button>
      </div>
        
      <div className={"lg:grid lg:grid-cols-2" }>
        <div className="flex items-center justify-center">
            <div className="grid gap-6 mx-auto">
            <div className="grid justify-center gap-2 text-center">
                <div className="ml-auto mr-auto">
                            <NewLogo />
                        </div>
                        <h1 className="text-3xl font-bold">Forgot Your Password</h1>
                        <p className="text-balance text-muted-foreground">
                            You will receive instructions to reset your password
                        </p>
                    </div>
                <div className="grid gap-4">
                    <form
                        className=""
                        onSubmit={handleSubmit}
                        method="POST"
                        >
                        <div className="grid gap-2">
                            <Label htmlFor="email">Enter email address</Label>
                                <Input
                                id="usrname"
                                required
                                name="email"
                                type="text"
                                autoComplete="email"
                                title="Enter Your email"
                                vvalue={formData.email}
                                onChange={handleChange}
                                />
                                <Button type="submit" className="w-full">
                                        {isLoading ? (
                                            <span className="animate-pulse">Sending Link...</span>
                                                        ) : (
                                                        <span>Reset Password</span>
                                                        )
                                        }
                                </Button>
                                {response && (
                                    <div className={`mx-auto p-2 flex gap-x-2 rounded-xl ${response.status === "success" ? "bg-[#E6FFEA] border border-[#B6F2C2]" : "bg-[#FFF8F7] border border-[#F2DCDA]"}`}>
                                        <p className={` text-[14px] ${response.status === "success" ? "text-[#27A745]" : "text-[#F08278]"}`}>
                                            {response.message}
                                        </p>
                                    </div>
                                )}</div>
                    </form>
                    <div className="grid justify-center gap-2 text-center">
                        <p className="text-balance text-muted-foreground">
                            Having trouble logging in? <Link>Contact Support </Link> 
                            
                        </p>
                    </div>
                </div>
            </div>
        </div>
   
        <div className="items-center hidden bg-white lg:flex">
            <img
            src={oops}
            alt="Forget pPasword Image"
            className=""
            />
        </div>
        </div>
</div>

    

        </>
    );
};

export default ForgotPassword;
