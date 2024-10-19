"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import axios from 'axios';
import './resume.css'

const ResumePage = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null); // File type for file

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

  const submitImage = async (e: any) => {
    e.preventDefault();
    try {
      if (!file) {
        console.log("No file selected.");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      console.log(title, file);
      const result = await axios.post("/api/users/resume",formData, 
        {
          headers: {"Content-Type": "multipart/form-data"},
        }
      );
      console.log(result)
      
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log("Signup failed", error.response.data.error); // Log the specific error
        alert(error.response.data.error); // Show the error message in an alert
      } else {
          console.log("Signup failed", error.message);
          alert("Signup failed: " + error.message);
      }
    }
    setTitle("")
    setFile(null)
  };

  return (
    <div className='background'>
      <div className='background'>
        <form className='formStyle' onSubmit={submitImage}>
          <h4>Upload Resume PDF only</h4><br />
          <div className='inputContainer'>
            <input
              type='text'
              className='form-control'
              placeholder='Title'
              required
              onChange={(e) => setTitle(e.target.value)}
            /><br />
            <input
              type='file'
              className='form-control'
              accept='application/pdf'
              required
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]); // Set the first file if exists
                }
              }}
            />
          </div>
          <button className='btn-primary' type='submit'>
            Submit
          </button>
        </form>
      </div>

      <Link href="/profile" className='menu-button'>Menu</Link>
      <button onClick={logout} className="Logout">
        Logout
      </button>
    </div>
  )
}

export default ResumePage;
