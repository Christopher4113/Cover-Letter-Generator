import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email,emailType, userId}: any) => {
    try {
        //create a hash token
        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "smtp.gmail.com", //change to gmail when needed to //sandbox.smtp.mailtrap.io
            port: 465, //2525
            secure: true,
            auth: {
                user: process.env.user, //process.env.user 
                pass: process.env.pass    //process.env.pass
            }
        });

        const mailOptions = {
            from: 'christopher.L4n@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email": "Reset your password",
            html: `<p> Hello and thank you for signing up to use the AI-cover letter generator. <br> Click <a href="${process.env.DOMAIN}/${emailType == "VERIFY" ? "verifyemail":"resetpassword"}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/${emailType == "VERIFY" ? "verifyemail":"resetpassword"}?token=${hashedToken}
            </p>`
        } // when deploying we got to switch the proccess.env.DOMAIN to the website of the domain instead of local host
        //so deploy first get that domain and replace it in the .env file but then when we get our custom domain repalce that in the.env file

        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;


    } catch (error: any) {
        throw new Error(error.message);
    }
}
