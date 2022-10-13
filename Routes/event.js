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
let router=express();

router.post("/signup",async(req,res)=>{
    var {Role,Username,Name,Password,Phone,Email}=req.body;
   
  


    if(Username==undefined||null||typeof(Username)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at User Name"
        })
        return;
    }
    var existName= await userModel.findOne({userName:Username})
    if (existName !== null || undefined){
        res.status(200).json({
            status:false,
            msg:"Username already exists"
        })
        return;
    }
    if(Name==undefined||null||typeof(Name)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Name"
        })
        return;
    }
    if(Password==undefined||null||typeof(Password)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Password"
        })
        return;
    }
    if(Phone==undefined||null||typeof(Phone)!=="number"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Phone"
        })
        return;
    }
    var alreadyExists= await userModel.findOne({phone:Phone})
    if (alreadyExists !== null || undefined){
        res.status(200).json({
            status:false,
            msg:"Phone already registered"
        })
        return;
    }
    if(Email==undefined||null||typeof(Email)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Email"
        })
        return;
    }

    var encryptedPass= await bcrypt.hash(Password,10);

    const userData= new userModel();
    userData.role=Role;
    userData.userName=Username;
    userData.Name=Name;
    userData.password=encryptedPass;
    userData.phone=Phone;
    userData.email=Email;
    await userData.save();

    // var allData=await userData.find({});

    res.status(200).json({
        status:"true",
        output:userData
    })

});

router.post('/event/model/add',adminAuth,async(req,res)=>{
    try{

    var {Name,From,To,Venue,Host}= req.body;

    if(Name==undefined||null||typeof(Name)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Name"
        })
        return;
    }
    if(From==undefined||null||typeof(From)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at From"
        })
        return;
    }
    if(To==undefined||null||typeof(To)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at To"
        })
        return;
    }
    if(Venue==undefined||null||typeof(Venue)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Venue"
        })
        return;
    }
    if(Host==undefined||null||typeof(Host)!=="string"){
        res.status(200).json({
            status:false,
            data:"Error Occured at Host"
        })
        return;
    }
  

    const event= new eventmodel();
    event.name=Name;
    event.from=From;
    event.to=To;
    event.venue=Venue;
    event.host=Host;
    await event.save()

    // var allData=await event.findAll();

    res.status(200).json({
        status:'true',
        data:event
    })
}
catch(e){
    console.log(e);
}

})

router.post('/login',async(req,res)=>{
   
    try{
        var {Username,Phone,Password}= req.body

        var user = await userModel.findOne({phone:Phone})
        if(user==null || user == undefined){
            res.status(200).json({
                status:false,
                msg:"invalid credentials"
            })
            return;
        }
        if(await bcrypt.compare(Password,user.password)){
            var token =jwt.sign({user:user},"nest");
            var tokenData= new tokenModel();
            tokenData.userId= user._id;
            tokenData.token= token;
            await tokenData.save()
            return  res.status(200).json({
                status:true,
                msg:"Login Successful",
                token:tokenData
            })

            
        }else{
            return res.status(200).json({
                status:false,
                msg:"Password is wrong!!!"
            })
        }
       
    }catch(error){
        return console.log(error);
    }
    
})

router.post("/validate", async(req,res)=>{
    try{
    var {token}=req.body
    const tokenData = await tokenModel.findOne({token:token})
    if(tokenData==null||undefined){
        return res.status(200).json({
            status:false,
            msg:"User Token not found"
        })

    }
   
    return res.status(200).json({
        status:true,
        msg:"User token found",
        data:tokenData
});
}
catch(error){
    return res.status(200).json({
        status:false,
        msg:error
    })
}
})

router.post("/user/me", async(req,res)=>{
    try{
        let{token}=req.body
        var tokenData= await tokenModel.findOne({token:token}).populate("userId")
        if(tokenData===null||undefined){
            return res.status(200).json({
                status:false,
                msg:"Invalid Token"
            })
            return;
        }

        // const userData= await userModel.findOne({token:token})
        // if(userData===null||undefined){
        //     return res.status(200).json({
        //         status:false,
        //         msg:"User Data not found"
        //     })
        //     return;
        // }else{
            return res.status(200).json({
                status:true,
                msg:"User Data found",
                data:tokenData
            })
        // }

        // return res.status(200).json({
        //     status:true,
        //     msg:"Login Successfully using Token"
        // })
    }
    catch(error){
        console.log(error)
        return res.status(200).json({
            status:false,
            msg:error
        })
    }
})

router.post('/verify/token',adminAuth,(req,res)=>{
    try{
        return res.status(200).json({
            status:true,
            msg:"Login Successful"
        })
    }catch(error){
        return res.status(200).json({
            status:true,
            msg:error
        })
    }
})



router.post('event/edit',adminAuth,async(res,req)=>{
    try{
    var {eid,Ename,from,to,host,venue}=req.body;
    var event=await userModel.findOne({_id:eid})
    if(event===undefined||null){
        res.status(200).json({
            status:false,
            msg:"Event ID invalid"
        })
        return;
    }
    if(Ename!==undefined||null){
        event.name=Ename;
        res.status(200).json({
            status:true,
            msg:"Event name Updated"
        })
    }
    if(from!==undefined||null){
        event.from=from;
        res.status(200).json({
            status:true,
            msg:"From Date Updated"
        })
    }
    if(to!==undefined||null){
        event.to=to;
        res.status(200).json({
            status:true,
            msg:"To Date Updated"
        })
    }
    if(venue!==undefined||null){
        event.venue=venue;
        res.status(200).json({
            status:true,
            msg:"Venue Updated"
        })
    }
    if(host!==undefined||null){
        event.host=host;
        res.status(200).json({
            status:true,
            msg:"Host name Updated"
        })
    }

    event.save();
        return res.status(200).json({
            status:true,
            msg:'Event Edited Successfully'
        })
    }
    catch(error){
        return res.status(200).json({
            status:false,
            msg:error
        })
    }
})

router.post("/user/profile",async (req,res)=>{
    try{
        let{token}=req.body
        userAuth();
    }   
    catch(e){

    }
})

router.post('/event/list',adminAuth,async(req,res)=>{
    try{
        eventList=eventmodel.find()
        return res.status(200).json({
            status:true,
            data:eventList
        })
    }
    catch(error){
        return res.status(200).json({
            status:false,
            msg:error
        })
    }

})

router.post('/event/view',adminAuth,async(req,res)=>{
    try{
        var {eventId}=req.body
        var event=eventmodel.findOne({id:eventId})
        return res.status(200).json({
            status:true,
            data:event
        })
    }
    catch(error){
        return res.status(200).json({
            status:true,
            msg:error
        })
    }
})

router.post('/event/delete',adminAuth,async(req,res)=>{
    try{
        var {eventId}=req.body
        var event=eventmodel.updateOne({id:eventId})
        event.status="deleted"
        event.save()
        return res.status(200).json({
            status:true,
            msg:"Event Deleted"
        })
    }
    catch(error){
        return res.status(200).json({
            status:true,
            msg:error
        })
    }
})

router.post('/event/book',userAuth,async(req,res)=>{
    try{
        return res.status(200).json({
            status:true,
            data:""
        })
    }
    catch(error){
        return res.status(200).json({
            status:false,
            msg:error
        })
    }
})

module.exports=router;