import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Adjust the import path accordingly



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
        // Ensure only the necessary fields are sent to the frontend
        const formattedResumes = user.pdf.map((pdf: { title: string; file: string }) => ({
            title: pdf.title,
            file: pdf.file,
        }));

        return NextResponse.json(formattedResumes);
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
        return NextResponse.json({ message: "PDF deleted successfully" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status:500}
        )
    }
}