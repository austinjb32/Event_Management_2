const mongoose = require("mongoose");
var tokenModel= mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    token:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
        }
})
module.exports=mongoose.model("tokenModel",tokenModel);