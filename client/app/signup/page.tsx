"use client";
import React, { useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./styles.css";
import axios from 'axios';

const SignupPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: ""
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post("/api/users/signup",user);
      console.log("Signup success", response.data);
      router.push("/login")
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log("Signup failed", error.response.data.error); // Log the specific error
        alert(error.response.data.error); // Show the error message in an alert
      } else {
          console.log("Signup failed", error.message);
          alert("Signup failed: " + error.message);
      }
      // Reset the form fields
      setUser({
        email: "",
        password: "",
        username: ""
      });
    }finally {
      setLoading(false);
    }  
  }

  useEffect(() => {
    if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  },[user])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <div className="form-box">
          <form className="form">
            <span className="title">{loading ? "Processing" : "Signup"}</span>
            <span className="subtitle">
              Create a free account with your email.
            </span>
            <div className="form-container">
              <input type="text" className="input" placeholder="Username" id='username'value = {user.username} 
              onChange={(e) => setUser({...user,username: e.target.value})} />
              <input type="email" className="input" placeholder="Email" id='email' value = {user.email} 
              onChange={(e) => setUser({...user,email: e.target.value})} />
              <input type="password" className="input" placeholder="Password" id='password' value = {user.password} 
              onChange={(e) => setUser({...user,password: e.target.value})} />
            </div>
            <button onClick={onSignup} disabled={buttonDisabled}>{buttonDisabled ? "No Signup" : "Signup"}</button>
          </form>
          <div className="form-section">
            <p>
              Have an account? <Link href="/login">Login</Link>{" "}
            </p>
          </div>
        </div>



    </div>
  )
}

export default SignupPage