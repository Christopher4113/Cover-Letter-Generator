"use client";
import React from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./login.css";
import axios from 'axios';

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const onLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();    
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <div className="form-box2">
          <form className="form2">
            <span className="title2">Login</span>
            <span className="subtitle2">
              Hello Welcome!
            </span>
            <div className="form-container2">
              <input type="email" className="input" placeholder="Email" id='email' value = {user.email} 
              onChange={(e) => setUser({...user,email: e.target.value})} />
              <input type="password" className="input" placeholder="Password" id='password' value = {user.password} 
              onChange={(e) => setUser({...user,password: e.target.value})} />
            </div>
            <button onClick={onLogin}>Login</button>
          </form>
          <div className="form-section2">
            <p>
              Don't have an account? <Link href="/signup">Signup</Link>{" "}
            </p>
          </div>
        </div>



    </div>
  )
}

export default LoginPage