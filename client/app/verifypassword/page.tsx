"use client"
import axios from "axios";
import Link from "next/link";
import React, {useEffect,useState} from "react";
import "./verifypassword.css";

export default function VerifyPasswordPage() {
    const [token,setToken] = useState("");
    const [verified,setVerified] = useState(false);
    const [error,setError] = useState(false);

    const verifyNewPassword = async () => {
        try {
            await axios.post('/api/users/verifypassword', {token})
            setVerified(true);
        } catch (error:any) {
            setError(true);
            console.log(error.response.data);
        }
    }
    useEffect(() => {
        const urlToken = window.location.search.split("=")
        [1];
        setToken(urlToken || "");
    },[]);
    useEffect(() => {
        if (token.length > 0) {
            verifyNewPassword();
        }
    },[token]);
    return (
        <div className="flex-container">
            <h1 className="text-4xl">Verify New Password </h1>
            <h2 className="token">{token ? `${token}` : "no token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-2xl">New Password Verified</h2>
                    <Link className="login-button" href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    
                </div>
            )}

        </div>
    );
}