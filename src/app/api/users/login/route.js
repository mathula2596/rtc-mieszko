import { connect } from "../../../../db/dbConfig";
import {NextResponse } from "next/server";
import User from "../../../../models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserType } from "../../../../helpers/getDataFromToken";
// import { sendNotificationToUsers } from "../../../../services/server";

connect()

export async function POST(request) {
    try {
        const reqBody = await request.json()
        const {username,password} = reqBody
        console.log(reqBody)

        const user = await User.findOne({username})

        if(!user){
            return NextResponse.json({error:"not registered"})
        }

        const verifyPassword = await bcryptjs.compare(password,user.password)
        if(!verifyPassword){
            return NextResponse.json({error:"password wrong"})
        }

        if(!user.isActive){
            return NextResponse.json({error:"user is not active call admin"})
        }

        const tokenData = {
            id:user._id,
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1h"})

        // sendNotificationToUsers({ message: 'Testing trigger'});
        const response = NextResponse.json({
            message:"Login success",
            success:true
        })

        response.cookies.set("token",token,{httpOnly:true})
        
        return response
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function GET(request) {
    try {
        const userType =  await getUserType(request)
        // console.log(userType)
        return NextResponse.json({
            data:userType,
            success:true
        })

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}