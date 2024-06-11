import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { SourceCode } from "eslint";
import { isNativeError } from "util/types";


 export async function POST (request  : Request ) {
    await dbConnect() 
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
        const existingUserByEmail = UserModel.findOne({email})
        


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