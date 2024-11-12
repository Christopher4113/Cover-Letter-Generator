import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true
        })
        //clear token and setting some options such as http to being true
        // Set cookie expiration to the past to clear it
        // Set Cache-Control to prevent caching
        response.headers.set('Cache-Control', 'no-store');
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: 'none', // To ensure it's sent cross-origin
            secure: true,     // To ensure it's sent over HTTPS
        });
        return response
    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}