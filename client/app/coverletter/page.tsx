"use client"
import './cover.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
interface PdfDetails {
  title: string,
  file: string
}
const CoverLetterPage = () => {
  const router = useRouter();
  const [info, setInfo] = useState<PdfDetails[]>([]); // Define info state with PdfDetails type


  const logout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
        await axios.get("/api/users/logout");
        router.push("/login");
    } catch (error: any) {
        console.log(error.message);
    }
  };
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get("/api/users/resume");
        console.log("Resume data fetched: ", response.data);
        setInfo(response.data); // Update info with fetched data
      } catch (error: any) {
        console.error("Failed to fetch resume data: ", error);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className='coverBackground'>
         <Link href="/profile" className='menu-button'>Menu</Link>
          <button onClick={logout} className="Logout">
              Logout
          </button>

          <div className="displayResume2 mt-4">
                <table className="table table-bordered rounded">
                    <thead className="thead-dark">
                        <tr>
                            <th>Title</th>
                            <th>File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {info.map((pdf, index) => (
                            <tr key={index}>
                                <td>{pdf.title}</td>
                                <td>
                                    <Link href={`${pdf.file}`} target="_blank">URL</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
          </div>


    </div>
  )
}

export default CoverLetterPage