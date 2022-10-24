const mongoose=require("mongoose")
const eventBooking=mongoose.Schema({
    status:{
        default:'Active',
        type:String
    },
    name:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"eventmodel"
    },
    date:{
        type:Date,
        default:new Date()
    },
    noOfSeats:{
        type:Number
    },
    adult:{
        type:Number
    },
    children:{
        type:Number
    },
    totalAmount:{
        type:Number
    }
    
})
module.exports=mongoose.model("eventBooking",eventBooking)