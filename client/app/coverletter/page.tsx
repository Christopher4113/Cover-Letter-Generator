"use client"
import './cover.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';

interface CoverLetter {
  filename: string;
  content: string;
}

interface PdfDetails {
  title: string;
  file: string; // Assuming this holds the file URL or path
}

const CoverLetterPage = () => {
  const router = useRouter();
  const [info, setInfo] = useState<PdfDetails[]>([]);
  const [selectedResume, setSelectedResume] = useState<PdfDetails | null>(null); // Updated type
  const [jobDescription, setJobDescription] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get("/api/users/resume");
        console.log("Resume data fetched: ", response.data);
        setInfo(response.data);
      } catch (error: any) {
        console.error("Failed to fetch resume data: ", error);
      }
    };
    fetchResumes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (!selectedResume) {
        alert("Please select a resume.");
        return;
      }
    try {
      // Fetch the file and convert it to a File object
      const formData = new FormData();
      // Fetch the file from the URL and convert to Blob
      const result = await fetch(selectedResume.file);
      const blob = await result.blob();
      formData.append("resume",blob, selectedResume.title);  // File object for resume
      formData.append("jobDescription", jobDescription);
      formData.append("today", today);
      formData.append("company", company);
      formData.append("location", location);
      
      
      const response = await axios.post("http://localhost:8000/generate_cover_letters", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
      });
      console.log("Cover letter generated: ", response.data);
      setCoverLetters(response.data);
      alert("Cover letter generated successfully!"); 
    } catch (error: any) {
      console.log("Generation failed", error.response?.data || error.message);
      alert(`Generation failed: ${error.response?.data?.message || error.message}`);
    }
    setSelectedResume(null);
    setJobDescription('');
    setToday('');
    setCompany('');
    setLocation('');
  }

  return (
    <div className='coverBackground'>
      <Link href="/profile" className='menu-button'>Menu</Link>
      <button onClick={logout} className="Logout">
        Logout
      </button>

      <div className="displayResume2 mt-4">
        <table className="table table-bordered rounded">
          <thead className="thead-dark">
            <tr>
              <th>Title</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {info.map((pdf, index) => (
              <tr key={index}>
                <td>{pdf.title}</td>
                <td>
                  <Link href={`${pdf.file}`} target="_blank">URL</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br/>
      <br/>
      <div className='createCV'>
        <form className="formStyling" onSubmit={handleSubmit}>
          <h4>Please Fill Out Form</h4>
          <label htmlFor="resumeSelect">Select Resume:</label>
          <select
            id="resumeSelect"
            onChange={(e) => setSelectedResume(info.find(pdf => pdf.file === e.target.value) || null)} // Set selectedResume to PdfDetails object
            required
          >
            <option value="" disabled>Select a resume</option>
            {info.map((pdf, index) => (
              <option key={index} value={pdf.file}>{pdf.title}</option>
            ))}
          </select>

          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
          <label htmlFor="today">Today's Date</label>
          <input id='today' value={today} onChange={(e) => setToday(e.target.value)} required placeholder='Enter date'></input>
          <label htmlFor="company">Company Name</label>
          <input id='company' value={company} onChange={(e) => setCompany(e.target.value)} required placeholder='Enter Company'></input>
          <label htmlFor="location">Job Location</label>
          <input id='location' value={location} onChange={(e) => setLocation(e.target.value)} required placeholder='Enter Location'></input>
          
          <button type="submit" className="generateButton">
            Generate Cover Letter
          </button>
        </form>

        {/* Display generated cover letters */}
        <div>
          {coverLetters.length > 0 && (
            <div>
              <h2>Generated Cover Letters</h2>
              {coverLetters.map((letter, index) => (
                <div key={index}>
                  <h3>{letter.filename}</h3>
                  <p>{letter.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoverLetterPage;
