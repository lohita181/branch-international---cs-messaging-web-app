import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId : {type:Number, required: true},
    userName : {type:String, required: true},
    messageText : {type:String, required: true},
    urgency : {type: String, enum:["high","medium","low"]},
    status: {type:String, enum:["replied","open"], default:"open"},
    agentReply: String,
    createdAt: {type:Date, default:Date.now},
    repliedAt: Date
})

export default mongoose.model("Message", messageSchema);