import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {Request,Response,NextFunction} from "express"
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
dotenv.config();

interface DecodedData{
    id:string
}


const userMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    const token = req.cookies?.userToken;
    console.log("in middleware")
    console.log(token);
    console.log(req.cookies);
    if(!token){
        res.status(401).json({ message: "Unauthorized, no token provided" });
        return;
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string) as DecodedData
        //@ts-ignore
        req.id = decoded.id;
        next();
    }
    catch(err){
        console.log("Invalid token");
        res.status(401).json({ message: "Invalid or expire token" });
        return;
    }
}

export default userMiddleware;