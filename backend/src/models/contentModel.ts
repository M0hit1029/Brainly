import mongoose from "mongoose";
const contentTypes = ["youtube","twitter"]
const contentSchema = new mongoose.Schema(
    {
        link:{
            type:String,
            required:true
        },
        type:{
            type:String,
            enum: contentTypes,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        tag:[{type:mongoose.Schema.Types.ObjectId,ref:'tags'}],
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users',
            required:true
        }
    },
    {
        timestamps: true
    }
)

const contentModel = mongoose.model('content',contentSchema);
export default contentModel;