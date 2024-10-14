"use client"
import axios from "axios";
import Link from "next/link";

import {toast} from "react-hot-toast"
import React, {useState} from 'react'
import { useRouter } from "next/navigation";
import './profile.css';
const ProfilePage = () => {
  const router = useRouter();
  const [data,setData] = useState("nothing")
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
  const getUserDetails = async () => {
    const res = await axios.get('/api/users/me');
    console.log(res.data);
    setData(res.data.data._id)
  }
  return (
    <div className='centered-container'>
       <h1>Profile</h1>
       <hr />
       <p>Profile Page</p>
       <h2 className="nothing">{data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
       <br />
       <button onClick={logout} className="Logout">Logout</button>
       <button className="custom-button" onClick={getUserDetails} >GetUser Details</button>
    </div>
  )
}

export default ProfilePage
