import mongoose from "mongoose";
import { Tapestry } from "next/font/google";

type ConnectionObject = {
    isConnected?: number
}


const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected) {
        console.log("The Database is already connected!");
        return 
    }


    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})
        //if url is not available empty string is passed to fetch the error
        connection.isConnected = db.connections[0].readyState

        console.log("DATABASE CONNECTED SUCCESSFULLY");
        console.log(db.connections);
        console.log(db.connections[0]);

        
        } catch (error) {
        console.log("Database Connection Failed" , error);

        process.exit(1);
    }
}

export default dbConnect;