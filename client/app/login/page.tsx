"use client";
import React, { useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./login.css";
import axios from 'axios';
import {toast} from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login",user);
      console.log("Login success", response.data);
      toast.success("Login Success")
      router.push("/profile");
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log("Login failed", error.response.data.error); // Log the specific error
        alert(error.response.data.error); // Show the error message in an alert
      } else {
          console.log("Login failed", error.message);
          alert("Login failed: " + error.message);
      }
      // Reset the form fields
      setUser({
        email: "",
        password: "",
      });
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
    <div className='flex flex-col items-center justify-center min-h-screen py-2 login-img'>
        <div className="form-box2">
          <form className="form2">
            <span className="title2">{loading ? "Processing": "Login"}</span>
            <span className="subtitle2">
              Hello Welcome!
            </span>
            <div className="form-container2">
              <input type="email" className="input" placeholder="Email" id='email' value = {user.email} 
              onChange={(e) => setUser({...user,email: e.target.value})} />
              <input type="password" className="input" placeholder="Password" id='password' value = {user.password} 
              onChange={(e) => setUser({...user,password: e.target.value})} />
            </div>
            <button onClick={onLogin} disabled={buttonDisabled}>{buttonDisabled ? "No Login": "Login"}</button>
          </form>
          <div className="form-section2">
            <p>
              Don&apos;t have an account? <Link href="/signup">Signup</Link>{" "}
            </p>
            <p>
              Forgot Password? <Link href="/forgot">Forgot Password</Link>
            </p>
          </div>
        </div>



    </div>
  )
}

export default LoginPage