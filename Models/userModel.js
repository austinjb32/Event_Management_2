const mongoose= require("mongoose");

var userModel= mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    role:{
        type:String
    },
    userName:{
        type:String
    },
    name:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    email:{
        type:String
    }
})

module.exports=mongoose.model("userModel",userModel);