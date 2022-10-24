const { json } = require("body-parser");
const express=require("express");
const eventmodel = require("../Models/eventmodel");
const userModel = require("../Models/userModel");
const bcrypt= require('bcryptjs');
const jwt=require("jsonwebtoken");
const tokenModel = require("../Models/tokenModel");
const { compare } = require("bcrypt");
const adminAuth = require("../Middleware/adminAuth");
const userAuth = require("../Middleware/userAuth");
const eventBooking = require("../Models/eventBooking");
let router=express();

router.post('/user/profile',userAuth,async (req,res)=>{
    var UserId=req.user.user._id
    var userProfile=await userModel.findOne({_id:UserId})
    try{
        return res.status(200).json({
            status:true,
            data:userProfile
        })
    }catch(error){
        return res.status(200).json({
            status:true,
            msg:error
        })
    }
})

router.post('/event/user/list',userAuth,async(req,res)=>{
    try{
        var today= new Date();
        let allEvents = await eventmodel.find({status:'Active',from:{$gte:today}})
        return res.status(200).json({
            status:true,
            data:allEvents
        })
    }catch(error){
        return res.status(200).json({
            status:true,
            msg:error
        })
    }
})

router.post('/event/user/view',userAuth,async(req,res)=>{
    try{
        var{id}=req.body
        let event= await eventmodel.find({_id:id})
        return res.status(200).json({
            status:true,
            data:event
        })
    }catch(error){
       return res.status(200).json({
            status:false,
            error:error
        })
    }
})

router.post('/event/user/add',userAuth,async(req,res)=>{
    try{
        var {EventName,EventID,NoOfSeats,Adult,Children,TotalAmount}=req.body;
        if(EventName===null||undefined){
            return res.status(200).json({
                status:false,
                msg:"Event name is not defined"
            })
        }
        if(EventID===null||undefined){
            return res.status(200).json({
                status:false,
                msg:"EventID is not defined"
            })
        }
        if(NoOfSeats===null||undefined){
            return res.status(200).json({
                status:false,
                msg:"No of Seats is not defined"
            })
        }
        if(Adult===null||undefined){
            return res.status(200).json({
                status:false,
                msg:"Adult is not defined"
            })
        }
        if(Children===null||undefined){
            return res.status(200).json({
                status:false,
                msg:"Children is not defined"
            })
        }
        if(NoOfSeats!==(Adult+Children)){
            return res.status(200).json({
                status:false,
                msg:"Total Seats are not correct"
            })
        }
        let amountRequired= Adult*50+Children*20
        if(TotalAmount!==amountRequired){
            return res.status(200).json({
                status:false,
                msg:"Amount is insufficient"
            })
        }
        let bookingEvent=new eventBooking();
        bookingEvent.name=EventName
        bookingEvent.userId=req.user.user._id
        bookingEvent.eventId=EventID
        bookingEvent.adult=Adult
        bookingEvent.children=Children
        bookingEvent.totalAmount=TotalAmount
        await bookingEvent.save()
        return res.status(200).json({
            status:true,
            data:bookingEvent
        })
    }
        catch(error){
            console.log(error)
        return res.status(200).json({
            status:false,
            error:error
        })
    }
})

router.post('/booking/user/list',userAuth,async(req,res)=>{
    try{
        var {token}=req.body;
        var bookingEvent=await eventBooking.find({status:"Active",userId:req.user.user._id})
        return res.status(200).json({
            status:true,
            data:bookingEvent
        })
    }catch(error){
        return res.status(200).json({
            status:false,
            error:error
        })
    }
})

module.exports=router;