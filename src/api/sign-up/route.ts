import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { SourceCode } from "eslint";
import { isNativeError } from "util/types";
import { messageSchema } from "@/schemas/messageSchema";
import { CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH } from "next/dist/shared/lib/constants";


 export async function POST (request  : Request ) {
    await dbConnect() 
    console.log("reached here")
    try {
        const {username , email , password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username, 
                isVerified : true 
            }
        
        )
        //this works like an AND condition where if the user is verified then only the response (username is retrieved from the database) is sent
        if(existingUserVerifiedByUsername ) {
            return Response.json({
                success : false,
                message : "Username is already taken"
            } , {
                status : 400
            })
        }
        const existingUserByEmail = await UserModel.findOne({email}) 

        const verifyCode  = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success :false ,
                    message : "User already exists for this account."
                } ,{
                    status : 400
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hashedPassword
                //imagine if a user comes and it submits the email which is existing but not verified , then we have to add the new password entered into the already existing password and then complete the email process.
                //remember all this is for signup
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                
                //the user model which was found by email was checked and then saved
                await existingUserByEmail.save()
            }
        }
        else{
            //if the user doesnot exist then make a new account for it  
            const hashedPassword = await bcrypt.hash(password , 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()  + 1)

            const newUser = new UserModel ({
                username,
                password : hashedPassword,
                email,
                isAccepting: true, //by default the user is accepting messages 
                isVerified : false, //by default the user is not verified
                verifyCode,
                verifyCodeExpiry : expiryDate,
                message :[]
            })

            await newUser.save()
        }
        //send verification email
        const emailResponse = await sendVerificationEmail (email ,username , verifyCode )

        if(!emailResponse.success){
            return Response.json({
                success : false,
                message : emailResponse.message
            } , {
                status : 201
            })
        }
        return Response.json ({
            success : true ,
            message : "User Registered. Please verify your email."
        } ,{
            status : 200
        })

    } catch (error) {
        console.error("Error Rgistering User")
        return Response.json({
            success : false,
            message : " Error Registering User"
        } ,
        {
            status : 500
            //incase the data base is not connected!
        })
    }
}

