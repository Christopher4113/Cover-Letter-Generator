"use client"

import React from 'react'
import './start.css';
import Link from "next/link";

const StartPage = () => {
  return (
    <div className='background'>
        <Link href="/login" className="btn">
            <span>Get started</span>
        </Link>

    </div>
  )
}

export default StartPage