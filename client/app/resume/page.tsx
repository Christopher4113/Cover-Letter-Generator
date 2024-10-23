"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import './resume.css';
import { useEdgeStore } from '@/lib/edgestore';
import { url } from 'inspector';


const ResumePage = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null); // File type for file
    const [progress, setProgress] = useState(0);
    const [urls, setUrls] = useState<{ url: string }>({ url: '' });
    const {edgestore} = useEdgeStore();
    const router = useRouter();

    /****  Retrieve the token from cookies
    const getTokenFromCookies = () => {
        const cookieName = "token=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    };

    useEffect(() => {
        const token = getTokenFromCookies();
        if (!token) {
            // If no token, redirect to login
            router.push("/login");
        }
    }, [router]);
    *******/

    const logout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await axios.get("/api/users/logout");
            router.push("/login");
        } catch (error: any) {
            console.log(error.message);
        }
    };
    /**** 
    const submitImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            console.log("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            const result = await axios.post("/api/users/resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true, // Ensure cookies (with token) are sent if needed
            });

            console.log(result.data);
            setTitle("");
            setFile(null);
            alert("File uploaded successfully!");

        } catch (error: any) {
            console.log("Upload failed", error.response?.data || error.message);
            alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        }
    };
    ****/
    const uploadFile = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (file) {
                const res = await edgestore.myPublicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        setProgress(progress);
                    }

                })
                setUrls({ url: res.url });
                setProgress(0);
                //save data to mongodb

            }
        } catch (error:any) {
            console.log("Upload failed", error.response?.data || error.message);
            alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        }
    }

    return (
        <div className='background'>
            <form className='formStyle' onSubmit={uploadFile}>
                <h4>Upload Resume PDF only</h4><br />
                <div className='inputContainer'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Title'
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    /><br />
                    <input
                        type='file'
                        className='form-control'
                        accept='application/pdf'
                        required
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                <div className='progress-bar'>
                        <div
                            className='inner'
                            style={{
                                width: `${progress}%`
                            }}
                        />
                </div>
                <button className='btn-primary' type='submit'>
                    Submit
                </button>
                {urls?.url && <Link href={urls.url} target='_blank'>URL</Link>}
            </form>
            <Link href="/profile" className='menu-button'>Menu</Link>
            <button onClick={logout} className="Logout">
                Logout
            </button>
        </div>
    );
}

export default ResumePage;
