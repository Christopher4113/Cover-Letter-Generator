"use client"
import axios from "axios";
import Link from "next/link";
import {toast} from "react-hot-toast"
import React from 'react'
import { useRouter } from "next/navigation";
import './profile.css';
const ProfilePage = () => {
  const router = useRouter();
  const logout = async (e: any) => {
    try {
      e.preventDefault();
      await axios.get('/api/users/logout')
      toast.success('Logout successful')
      router.push('/login')

    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  }
  return (
    <div className='centered-container'>
       <h1>Profile</h1>
       <hr />
       <p>Profile Page</p>
       <button onClick={logout} className="Logout">Logout</button>
    </div>
  )
}

export default ProfilePage
