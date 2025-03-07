import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/db';
import cookieParser from "cookie-parser";
import userModel from './models/userModel';
import contentModel from './models/contentModel';
import tagModel from './models/tagsModel';
import linkModel from './models/linkModel';
import userMiddleware from './middlewares/userMiddleware';
import random from './utils/utils';
import mongoose from 'mongoose';

import { Request, Response } from "express";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY as string
const app = express();
app.use(cors({
    origin: "http://localhost:5173",  // ✅ Replace with frontend URL
    credentials: true,                // ✅ Allow cookies/auth headers
}));
app.use(cookieParser());
app.use(express.json());


app.post('/api/v1/signup',async (req,res)=>{
    const {userName,userPassword} = req.body;
    try{
        console.log(userName + userPassword);
        const user = await userModel.findOne({userName:userName});
        if(!user){
            userModel.create({
                userName,
                userPassword
            })
            res.status(200).json({message:"User Created"}) 
        }
        else{
            console.log(user);
            console.log("User already exists");
            res.status(200).json({message:"User already Exist"})
        }
    }
    catch(err){
        console.log("Chud Gaye Guru!!!");
    }
})

app.post('/api/v1/signin',async (req,res)=>{
    const {userName,userPassword} = req.body;
    try{
        const user = await userModel.findOne({
            userName,
            userPassword
        })
        if(user){
            const token = jwt.sign({id:user._id},JWT_SECRET)
            res.cookie('userToken',token,{
                httpOnly: true, // Prevents client-side access to the cookie
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "strict", // Helps prevent CSRF attacks
                maxAge: 24 * 60 * 60 * 1000,
            })
            //console.log(req.cookies + "cookies");
            res.status(200).json({token:token})
        }
        else{
            res.status(301).json({message:"user not found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({message:"Chud Gaye Guru!!!"})
    }
})

app.post('/api/v1/content',userMiddleware,async (req,res)=>{
    const {link,type,title} = req.body;
    console.log(link + " " + type + " " + title);
    //@ts-ignore
    const userId = req.id;
    await contentModel.create({
        link,
        type,
        title,
        tag:[],
        userId:userId
    })
    res.status(200).json({message:"Content Added"})
})

app.get('/api/v1/content',userMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId = req.id;
    const content = await contentModel.find({userId:userId}).populate("userId","userName");
    res.json(content);
})

app.delete('/api/v1/content',userMiddleware,async (req,res)=>{
    const contentId = req.body.contentId;
    //@ts-ignore
    console.log("user : " + req.id);
    //@ts-ignore
    await contentModel.deleteOne({ _id:contentId, userId: req.id });
    res.json({ message: "Deleted" });
})

app.post('/api/v1/share', userMiddleware, async (req, res) => {
    const share = req.body;

    if (share) {
        //@ts-ignore
        const oldLink = await linkModel.findOne({ userId: req.id });

        if (oldLink) {
            // ✅ Update `sharedAt` to the current date & time
            oldLink.sharedAt = new Date();
            await oldLink.save();

            res.json({
                hash: oldLink.hash
            });
            return;
        }

        // Generate a new hash if no previous link exists
        const hash = random(10);
        await linkModel.create({
            //@ts-ignore
            userId: req.id,
            hash: hash,
            sharedAt: new Date() // ✅ Set initial timestamp
        });

        res.json({
            hash: hash
        });
        return;
    } else {
        res.json({
            message: "Not shared!!!"
        });
    }
});


//@ts-ignore
app.get('/api/v1/brain/:shareLink', userMiddleware, async (req, res) => {
    try {
        const str = req.params.shareLink;

        if (!str) {
            return res.status(400).json({ message: "shareLink is required" });
        }

        const link = await linkModel.findOne({ hash: str });

        if (!link) {
            return res.status(404).json({ message: "Incorrect share link!!!" });
        }

        // ✅ Fetch only content created BEFORE the link was shared
        const content = await contentModel.find({
            userId: link.userId.toString(),
            createdAt: { $lte: link.sharedAt } // ✅ Only fetch content before `sharedAt`
        });

        const user = await userModel.findOne({ _id: link.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            content: content,
            ownerName: user.userName
        });

    } catch (error) {
        console.error("Error fetching brain data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.listen(3000, ()=>{
    connectDB();
    console.log('Server running on 3000');
})

