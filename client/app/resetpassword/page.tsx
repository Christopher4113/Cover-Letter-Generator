"use client"
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import "./verifypassword.css";

export default function ResetPasswordPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyNewPassword = useCallback(async () => {
        try {
            await axios.post('/api/users/resetpassword', { token });
            setVerified(true);
        } catch (error: any) {
            setError(true);
            console.log(error.response.data);
        }
    }, [token]);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyNewPassword();
        }
    }, [token, verifyNewPassword]);

    return (
        <div className="flex-container">
            <h1 className="text-4xl">Congrats You Verified New Password</h1>

            {verified && (
                <div>
                    <p>Click below to login</p>
                    <Link className="login-button" href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl">Error: There may have been a mistake when verifying Password</h2>
                </div>
            )}
        </div>
    );
}
