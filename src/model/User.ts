import { register } from "module";
import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document { 
    content : string;
    createdAt : Date;
}

const MessageSchema : Schema<Message> = new Schema ({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }
})

export interface User extends Document { 
    username  : string ,
    password : string,
    email : string ,
    isAccepting : boolean ,
    isVerified : boolean,
    verifyCode : string,
    verifyCodeExpiry : Date,
    message  : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true , "Username is required"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        trim : true, 
        // trim is used for neglecting spaces
        unique : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ /, "please provide a valid email address"]
    },
    password : {
        type : String,
        required : [true , "Password is required"]
    },
    verifyCode : {
        type : String,
        required : [true , "Verification code is required"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true , "Verification code expiry is required"]
    },
  isVerified : {
            type : Boolean,
            default  : false
        },
    isAccepting : {
        type  : Boolean,
        default : true
    },
    message : [MessageSchema]
})



const UserModel = (mongoose.models.User  as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))

export default UserModel;