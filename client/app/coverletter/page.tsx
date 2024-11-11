"use client"
import './cover.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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
  const [loading, setLoading] = React.useState(false);
  const [info, setInfo] = useState<PdfDetails[]>([]);
  const [selectedResume, setSelectedResume] = useState<PdfDetails | null>(null); // Updated type
  const [jobDescription, setJobDescription] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const serverURL = process.env.NEXT_PUBLIC_FASTAPI_URL;

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
        //default to first resume
        if (response.data.length > 0) {
          setSelectedResume(response.data[0]);
        }
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
      setLoading(true);
      const formData = new FormData();
      // Fetch the file from the URL and convert to Blob
      const result = await fetch(selectedResume.file);
      const blob = await result.blob();
      formData.append("resume",blob, selectedResume.title);  // File object for resume
      formData.append("jobDescription", jobDescription);
      formData.append("today", today);
      formData.append("company", company);
      formData.append("location", location);
      
      
      const response = await axios.post(`${serverURL}/generate_cover_letters`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
      });
      console.log("Cover letter generated: ", response.data);
      const generatedLetters = response.data.map((letter: CoverLetter) => {
        // Remove the first line
        const contentWithoutIntro = letter.content.replace(
          /^(Here is|This is|Based on).*:\s*/,
          ''
        );
        return {
          ...letter,
          content: contentWithoutIntro,
        };
      });

      setCoverLetters(generatedLetters);
      alert("Cover letter generated successfully!"); 
    } catch (error: any) {
      console.log("Generation failed", error.response?.data || error.message);
      alert(`Generation failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
    setSelectedResume(null);
    setJobDescription('');
    setToday('');
    setCompany('');
    setLocation('');
  }
  const resetPage = () => {
    setCoverLetters([]);
    setSelectedResume(null);
    setJobDescription('');
    setToday('');
    setCompany('');
    setLocation('');
  };
  const handleContentChange = (index: number, newContent: string) => {
    const updatedLetters = [...coverLetters];
    updatedLetters[index].content = newContent;
    setCoverLetters(updatedLetters);
  };

  const downloadPDF = (index: number) => {
    const letter = coverLetters[index];
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
  
    // Set margins and font properties
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;
    const maxLineWidth = pageWidth - margin * 2;
    const fontSize = 12;
    
    pdf.setFont("Arial");
    pdf.setFontSize(fontSize);
    pdf.setTextColor(0, 0, 0);
  
    // Split the text into lines that fit within the page width
    const lines = pdf.splitTextToSize(letter.content, maxLineWidth);
    
    // Add the text content line by line
    pdf.text(lines, margin, 60, { align: "left", baseline: "top" });
    
    // Save the PDF
    pdf.save(`${letter.filename}.pdf`);
  };

  return (
    <div className='coverBackground'>
      <Link href="/profile" className='menu-button1'>Menu</Link>
      <button onClick={logout} className="Logout1">
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
          <h4>{loading ? "Filling Form": "Please Fill Out Form"}</h4>
          <label htmlFor="resumeSelect">Select Resume:</label>
          <select
            id="resumeSelect"
            onChange={(e) => setSelectedResume(info.find(pdf => pdf.file === e.target.value) || null)} // Set selectedResume to PdfDetails object
            value={selectedResume?.file || ""}
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
      </div>
      <br/>
      {coverLetters.length > 0 && (
        <button onClick={resetPage} className='reset'>Make New Cover Letter</button>
      )}
      <br/>
      <br/>
      {coverLetters.length > 0 && (
        <h2 className='importantNote'>Note: Symbols or Emojiis will not render properly on the pdf when you download</h2>
      )}
      <br/>
      <br/>
      <div className='box'>
        {coverLetters.length > 0 && (
          <div>
            <h1 className='generation'>Generated Cover Letters</h1>
            {coverLetters.map((letter, index) => (
              <div key={index} className="coverLetter">
                <textarea
                  className="coverLetterContent"
                  value={letter.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
                <button onClick={() => downloadPDF(index)} className="downloadButton">Download as PDF</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <br/>
      
      
      
      
      
    </div>
  )
}

export default CoverLetterPage;
