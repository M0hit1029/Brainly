import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    hash:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true,
        unique:true
    },
    sharedAt: { type: Date, default: Date.now } 
})

const linkModel = mongoose.model('links',linkSchema);
export default linkModel;
