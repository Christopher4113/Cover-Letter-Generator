"use client";
import React from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./styles.css";
//import {axios} from 'axios';

const SignupPage = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: ""
  });
  const onSignup = async () => {    
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <div className="form-box">
          <form className="form">
            <span className="title">Sign up</span>
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
            <button onClick={onSignup}>Sign up</button>
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