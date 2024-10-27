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