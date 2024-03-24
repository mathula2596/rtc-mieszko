import { connect } from "../../../../../db/dbConfig";
import { NextResponse } from "next/server";
import User from "../../../../../models/userModel";
import crypto from "crypto"

connect()

export async function POST(request,{params}) {
    console.log(params)
    try {
        const token = params.token

        const hashedToken =crypto.createHash("sha256").update(token).digest("hex")
        console.log(hashedToken)

        const user = await User.findOne({resetToken:hashedToken})

        if(!user){
            return NextResponse.json({error:"Not valid user"})
        }
        if(user.resetExpiry<Date.now()){
            return NextResponse.json({error:"Link expired"})
        }

        const response = NextResponse.json({
            message:user,
            success:true
        })

        return response
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

