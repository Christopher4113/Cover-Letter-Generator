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
    const [urls, setUrls] = useState<{
        url: string,
    }>();
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
    const uploadFile = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setUrls(undefined);
            if (file) {
              const res = await edgestore.myPublicFiles.upload({
                file,
                onProgressChange: (progress) => {
                  // you can use this to show a progress bar
                  console.log(progress);
                  setProgress(progress);
                },
              });
              // you can run some server action or api here
              // to add the necessary data to your database
              await axios.post("/api/users/resume",title,res);

              console.log(res);
              setUrls({url:res.url});
              setProgress(0);

            }
        } catch (error:any) {
            console.log("Upload failed", error.response?.data || error.message);
            alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        }
        setFile(null)
        setTitle("")
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
