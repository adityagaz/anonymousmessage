import { resend } from "@/lib/Resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponses";

export async function sendVerificationEmail (
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anony Review Verification Code',
            react: VerificationEmail({ username : username , otp : verifyCode}),
          });
        return  {
            success : true  , message : "Verification Email sent successfully!"
        }
    } catch (emailError) {
        console.log("Error sending Verification Email")
        return  {
            success : false  , message : "Failed to send Verification Email"
        }
    }

}