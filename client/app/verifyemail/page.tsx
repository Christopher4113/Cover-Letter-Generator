"use client";
import axios from "axios";
import Link from "next/link";
import React, {useEffect,useState} from "react";
import "./verifyemail.css"


export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', {token})
            setVerified(true);
        } catch (error: any) {
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
        if(token.length > 0) {
            verifyUserEmail();
        }
    },[token]);
    return (
        <div className="flex-container">
            <h1 className="text-4xl">Email Verified</h1>

            {verified && (
                <div>
                    <p>Click Here To Login</p>
                    <Link className="login-button" href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl">Error: There may have been a mistake when verifying Password </h2>
                    
                </div>
            )}

        </div>
    );
}