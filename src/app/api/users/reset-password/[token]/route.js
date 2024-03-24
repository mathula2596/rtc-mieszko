import { connect } from "../../../../../db/dbConfig";
import { NextResponse } from "next/server";
import User from "../../../../../models/userModel";
import bcryptjs from "bcryptjs";

connect()

export async function POST(request,{params}) {
    try {
        const token = params.token
        const reqBody = await request.json()

        const {email,password} = reqBody

       
        const user = await User.findOne({email:email})

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)

        user.password = hashedPassword
        user.resetToken = undefined
        user.resetExpiry = undefined
        user.save()

        const response = NextResponse.json({
            message:"Password has been updated!",
            success:true
        })

        return response
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

