import { z } from 'zod'


export const messageSchema = z.object ({
content : z.string().min(10 , 'message should be atleast of minimum ten characters').max(300 , "Message must be maximum of 300 characters")
 
})