import {connect} from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {token} = reqBody
        console.log(token);

        const user = await User.findOne({forgotPasswordToken: token,
            forgotPasswordTokenExpiry: {$gt: Date.now()}});
        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status:400});
        }
        console.log(user);

        user.isVerified = true;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "New password verified",
            success: true
        });
        
    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status:500})
    }
}