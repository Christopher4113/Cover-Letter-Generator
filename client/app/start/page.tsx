"use client"

import React from 'react'
import './start.css';
import Link from "next/link";

export default function StartPage() {
  return (
    <div className="container">
      {/* Colorful gradient background */}
      <div className="background">
        <div className="svg-pattern" />
      </div>

      {/* Content */}
      <div className="content">
        <h1 className="title">
          Welcome to the<br />
          <span className="highlight">AI-Cover-Letter Generator</span>
        </h1>
        <Link href="/login" className="btn">
          <span>Get Started</span>
        </Link>
          
      </div>
    </div>
  );
}