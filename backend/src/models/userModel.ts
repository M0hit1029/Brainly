import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true
        },
        userPassword:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const userModel = mongoose.model('users',userSchema)
export default userModel;

