import { PassThrough } from 'stream'
import { z } from 'zod'


export const usernameValidation = 
z.string()
.min(2 ,  "Username must be more than two characters long")
.max(20 , "User name must be not more than 20 characters long")
.regex(/^[a-zA-Z0-9._]/ ,  "username contains invalid characters")


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string({message  : "Email should be a string"}).email( { message : "Invalid email address"}),
    password : z.string().min(6 , {message : "Password must be atleast six characters long"}).max(20 , {message : "password should not be more than twenty characters long"})
})