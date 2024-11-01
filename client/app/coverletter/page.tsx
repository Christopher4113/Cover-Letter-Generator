"use client"
import './cover.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
interface PdfDetails {
  title: string,
  file: string
}
const CoverLetterPage = () => {
  const router = useRouter();
  const [info, setInfo] = useState<PdfDetails[]>([]); // Define info state with PdfDetails type
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

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
        setInfo(response.data); // Update info with fetched data
      } catch (error: any) {
        console.error("Failed to fetch resume data: ", error);
      }
    };
    fetchResumes();
  }, []);

  const handleSubmit = async() => {
    try {
      const response = await axios.post("http://localhost:8000/ask", {
        resume: selectedResume,
        jobDescription
      });
      console.log("Cover letter generated: ", response.data);
      alert("Cover letter generated successfully!"); 
    } catch (error: any) {
      console.log("Delete failed", error.response?.data || error.message);
      alert(`Delete failed: ${error.response?.data?.message || error.message}`);
    }
    setSelectedResume('');
    setJobDescription('');
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
          <div className='createCV'>
            <form className="formStyling"onSubmit={handleSubmit}>
                <h4>Select a Resume and Input Job Description</h4>
                <label htmlFor="resumeSelect">Select Resume:</label>
                <select
                  id="resumeSelect"
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
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

                <button type="submit" className="generateButton">
                  Generate Cover Letter
                </button>
            </form>
          </div>


    </div>
  )
}

export default CoverLetterPage