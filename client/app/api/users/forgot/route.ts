import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";


connect()


export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email,password} = reqBody

        console.log(reqBody);
        const user = await User.findOne({email})

        if(!user) {
            return NextResponse.json({error: "User not found"},
                {status: 400})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)

        user.password = hashedPassword
        const updatedUser = await user.save();

        console.log(updatedUser);

        // Optionally, send a confirmation email about the password reset
        await sendEmail({ email, emailType: "RESET", userId: updatedUser._id });

        return NextResponse.json({
            message: "Password updated successfully",
            success: true,
            updatedUser
        });

    } catch (error: any) {
        return NextResponse.json({error:error.message},
            {status:500})
    }
}
