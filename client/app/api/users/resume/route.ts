import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '.files');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix+file.originalname);
    },
  });
  
const upload = multer({ storage: storage });


connect()

// Define the POST request handler
export const POST = async (req: NextRequest, res: NextResponse) => {
    return new Promise((resolve, reject) => {
      // Multer middleware to handle the file upload
      upload.single('file')(req as any, res as any, async (err: any) => {
        if (err) {
          // Handle multer errors
          return reject(
            NextResponse.json({ message: "File upload failed", error: err }, { status: 500 })
          );
        }
  
        try {
          // Process the uploaded file here (e.g., save file info to the database)

  
          resolve(
            NextResponse.json({ message: "File uploaded successfully" }, { status: 200 })
          );
        } catch (error) {
          // Handle any other errors
          reject(
            NextResponse.json({ message: "Server error", error }, { status: 500 })
          );
        }
      });
    });
  };