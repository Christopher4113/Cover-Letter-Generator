"use client"
import React, { useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./forgot.css";
import axios from 'axios';
import {toast} from 'react-hot-toast';

const ForgotPage = () => {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
      });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onNewPassword = async (e: any) => {
        e.preventDefault();
        try {
          setLoading(true);
          const response = await axios.post("/api/users/forgot",user);
          console.log("Changes success", response.data);
          toast.success("Changes Success")
          router.push("/profile"); 
        } catch (error:any) {
          console.log("Changes failed", error.message);
          toast.error(error.message);
        }finally {
          setLoading(false)
        }    
      }
    
    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        }
    },[user]);



  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 background-img'>
        <div className="form-box3">
          <form className="form3">
            <span className="title3">{loading ? "Processing": "Login"}</span>
            <span className="subtitle3">
              Hello Welcome!
            </span>
            <div className="form-container3">
              <input type="email" className="input" placeholder="Email" id='email' value = {user.email} 
              onChange={(e) => setUser({...user,email: e.target.value})} />
              <input type="password" className="input" placeholder="Password" id='password' value = {user.password} 
              onChange={(e) => setUser({...user,password: e.target.value})} />
            </div>
            <button onClick={onNewPassword} disabled={buttonDisabled}>{buttonDisabled ? "Change Password": "Change Password"}</button>
          </form>
          <div className="form-section3">
            <p>
              Don't have an account? <Link href="/signup">Signup</Link>{" "}
            </p>
            <p>
              Remembered Password? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
    </div>
  )
}

export default ForgotPage