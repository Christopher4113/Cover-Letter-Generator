"use client"
import './cover.css';
import { useEdgeStore } from '@/lib/edgestore';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';

const CoverLetterPage = () => {

  const {edgestore} = useEdgeStore();
  const router = useRouter();
  const [info,setInfo] = useState([])


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
        console.log("Resume data fetched: ", response.data)
      } catch (error:any) {
        console.error("Failed to fetch resume data: ", error);
      }
    }
  },[])

  return (
    <div className='coverBackground'>
         <Link href="/profile" className='menu-button'>Menu</Link>
          <button onClick={logout} className="Logout">
              Logout
          </button>
    </div>
  )
}

export default CoverLetterPage