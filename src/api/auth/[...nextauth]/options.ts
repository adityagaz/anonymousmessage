import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";


export const AuthOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "credentials",
            credentials : {
                email : {label : "Email" , type  : "text" , placeholder : "email"},
                password  : {label : "Password" , type : "password" , placeholder: "password"} 
            },
            async authorize(credentials : any ) : Promise<any>  {
                await dbConnect()

                try {
                    const user  = await UserModel.findOne({
                        $or: [
                            {email : credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    })
                    if(user) {
                        console.log("User is there!!! how cute is that! :)")
                    }
                    if(!user) {
                        throw new Error ('No user found with this email')
                    }
                    if(!user.isVerified) {
                        throw new Error('Please Verify your Email');
                    }
                    const isPasswordCorrect  = await bcrypt.compare(credentials.password , user.password)
                     //comparing the user's password stored in database to the password in the form
                    if(isPasswordCorrect) {
                        return user
                    }
                    else {
                        throw new Error("Incorrect User Password");
                    }
                } catch (error : any)  {
                    throw new Error(error)
                }

            }
        })
    ],
    callbacks : {
        async jwt ({token , user}) {
            if(user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages  = user.isAcceptingMessages
                token.username = user.username; 
            }
            return token
        },
        async session({session , token  }){
            session.user._id  =  token._id?.toString()
            session.user.isVerified  = token.isVerified 
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
            return session
        }
    },
    pages: {
        signIn : '/sign-in'
    },
    session  : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET
}
