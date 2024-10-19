"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import axios from 'axios';
import './resume.css'

const ResumePage = () => {
  const router = useRouter();

  const logout = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className='background'>



      
      
      <Link href="/profile" className='menu-button'> Menu </Link>
      <button onClick={logout} className="Logout">
        Logout
      </button>
    </div>
  )
}

export default ResumePage