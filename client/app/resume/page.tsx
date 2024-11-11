"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import './resume.css';
import { useEdgeStore } from '@/lib/edgestore';

interface PdfDetails {
    title: string,
    file: string
}

const ResumePage = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [info, setInfo] = useState<PdfDetails[]>([]);
    const { edgestore } = useEdgeStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
        e.preventDefault();
        try {
            setLoading(true);
            if (file) {
                const res = await edgestore.myPublicFiles.upload({ file });
                const fileUrl = res.url;
                
                await axios.post("/api/users/resume", {
                    title,
                    res: fileUrl,
                });

                setInfo((prevInfo) => [...prevInfo, { title, file: fileUrl }]);
            }
        } catch (error: any) {
            console.log("Upload failed", error.response?.data || error.message);
            alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
            setFile(null);
            setTitle("");
        }
    };

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const response = await axios.get("/api/users/resume");
                setInfo(response.data);
            } catch (error: any) {
                console.error("Failed to fetch resume data:", error);
            }
        };

        fetchResumes();
    }, []);

    const handleDelete = async (e: React.FormEvent, title: string, fileUrl: string) => {
        e.preventDefault();
        try {
            await edgestore.myPublicFiles.delete({ url: fileUrl });
            await axios.delete("/api/users/resume", { data: { title } });

            setInfo((prevInfo) => prevInfo.filter((pdf) => pdf.title !== title));
        } catch (error: any) {
            console.log("Delete failed", error.response?.data || error.message);
            alert(`Delete failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className='background'>
            <form className='formStyle' onSubmit={uploadFile}>
                <h4>{loading ? "Uploading" : "Upload Resume PDF only"}</h4><br />
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
                <button className='btn-primary' type='submit'>Submit</button>
            </form>
            <br />
            <Link href="/profile" className='menu-button'>Menu</Link>
            <Link href="/coverletter" className="gotocl">Generate Cover Letter</Link>
            <button onClick={logout} className="Logout">Logout</button>
            
            <div className="displayResume mt-4">
                <table className="table table-bordered rounded">
                    <thead className="thead-dark">
                        <tr>
                            <th>Title</th>
                            <th>File</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {info.map((pdf, index) => (
                            <tr key={index}>
                                <td>{pdf.title}</td>
                                <td>
                                    <Link href={`${pdf.file}`} target="_blank">URL</Link>
                                </td>
                                <td>
                                    <button className='delete' onClick={(e) => handleDelete(e, pdf.title, pdf.file)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResumePage;
