import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken';  // Ensure JWT is imported
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Adjust the import path accordingly
const SECRET_KEY = process.env.TOKEN_SECRET|| 'your-secret-key';  // Define the secret key


connect()

const authenticateToken = async (req: NextRequest) => {
    try {
        const userId = getDataFromToken(req); // Use your utility function to get user ID
        const user = await User.findById(userId); // Fetch user from the database
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return user; // Token is valid, return user data
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Authentication failed" }, { status: 403 });
    }
};

export async function POST(request: NextRequest) {
    try {
        const user = await authenticateToken(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const reqBody = await request.json()
        const {title, res} = reqBody

        const newFile = {
            title,
            file: res
        }
        user.pdf.push(newFile)
        await user.save();

        console.log("Authenticated user: ",user)

        return NextResponse.json({ message: "File uploaded successfully", user: user._id });

    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await authenticateToken(request);
        if (user instanceof NextResponse) {
            return user;
        }
        NextResponse.json(user.pdf);
    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status:500}
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const user = await authenticateToken(request);
        if (user instanceof NextResponse) {
            return user;
        }
        const reqBody = await request.json()
        const {title} = reqBody;

        const pdfIndex = user.pdf.findIndex((pdf: { title: string }) => pdf.title === title);
        if (pdfIndex === -1) {
            return NextResponse.json({ error: "PDF not found" }, { status: 404 });
        }

        // Remove the PDF from the array
        user.pdf.splice(pdfIndex, 1);
        await user.save(); // Save the updated user document

    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status:500}
        )
    }
}