"use client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import React from "react";
import { useRouter } from "next/navigation";
import './profile.css'; // Ensure the CSS file is included


const ProfilePage = () => {
  const router = useRouter();

  const logout = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="centered-container">
      <div className="menu">
        <h1 className="menuTitle">Menu</h1>
        <h6 className="menuDescription">
          Welcome to your resume toolkit. Choose an option below to get started.
        </h6>
        <br />
        <div className="resume-cover-container">
            <div className="resume">
              <div className="resume-icon"></div>
              <br/>
              <Link href="/resume" className="pushable">
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front">Upload Resume</span>
              </Link>
            </div>

            <div className="cover-letter">
              <div className="cover-letter-icon"></div>
              <br/>
              <Link href="/coverletter" className="pushable">
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front">Create Cover Letter</span>
              </Link>
            </div>
          </div>
        </div>
       
      <button onClick={logout} className="Logout">
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
