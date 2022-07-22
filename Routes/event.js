const express=require("express");
const userModel = require("../Models/userModel");

let router=express();

router.post("/signup",async(req,res)=>{
    var {Role,Username,Name,Password,Phone,Email}=req.body;
    var userData= new userModel();
    userData.role=Role;
    userData.userName=Username;
    userData.Name=Name;
    userData.password=Password;
    userData.phone=Phone;
    userData.email=Email;
    await userData.save();

    var allData=await userData.findAll();

    res.status(200).json({
        status:"true",
        output:allData
    })

});


module.exports=router;