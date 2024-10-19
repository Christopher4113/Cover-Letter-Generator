import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken';  // Ensure JWT is imported
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Adjust the import path accordingly
import { error } from "console";
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

