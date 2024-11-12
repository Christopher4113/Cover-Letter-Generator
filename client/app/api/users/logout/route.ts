import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true
        })
        //clear token and setting some options such as http to being true
        // Set cookie expiration to the past to clear it
        response.cookies.set("token", "", {
            httpOnly: true,  // Ensure the cookie is only accessible via HTTP
            secure: process.env.NODE_ENV === 'production',  // Set to true only in production for secure cookies
            expires: new Date(0),  // Expire the cookie
            path: '/',  // Ensure the cookie is cleared across all paths
            sameSite: 'strict',  // Use lowercase "strict"
            domain: 'cover-letter-generator-pi.vercel.app'
        });
        return response
    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}