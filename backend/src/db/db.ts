import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;
const connectDB = async ()=>{
    try{
        console.log(MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;
