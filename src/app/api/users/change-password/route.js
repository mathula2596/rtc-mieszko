import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import bcryptjs from "bcryptjs";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";

connect()

export async function POST(request) {
    try {
        const token =  await getDataFromToken(request)
        console.log(token)
        const reqBody = await request.json()
        const {password,confirmPassword} = reqBody
        console.log(password + " " +confirmPassword)
        if(password===confirmPassword){
            
            const user = await User.findOne({_id:token})
            console.log(user)

            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(password,salt)

            user.password = hashedPassword
            user.save()

            const response = NextResponse.json({
                message:"Password has been updated!",
                success:true
            })

            return response


        }
        
        const response = NextResponse.json({
            message:"Something gone wrong!",
            success:false
        })
        

        return response
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

