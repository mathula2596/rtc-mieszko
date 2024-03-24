import { connect } from "../../../../db/dbConfig";
import {  NextResponse } from "next/server";
import User from "../../../../models/userModel";
import crypto from "crypto"
import sendgrid from "@sendgrid/mail";

connect()

export async function POST(request) {
    try {
        const reqBody = await request.json()
        const {email} = reqBody

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error:"not registered"})
        }

        const resetToken = crypto.randomBytes(20).toString('hex')
        const passwordResetTokenToStore = crypto.createHash("sha256").update(resetToken).digest("hex")

        const passwordResetExpiry = Date.now() + 3600000

        user.resetToken = passwordResetTokenToStore
        user.resetExpiry = passwordResetExpiry

        const resetUrl = `${process.env.DOMAIN}/reset-password/${resetToken}`
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
        
        await sendgrid.send({
            to: user.email,
            from: "mathula@mieszko.uk", 
            subject: `Reset your Password`,
            text: `${resetUrl}`,
        });

        
        user.save()

        const response = NextResponse.json({
            message:"Please check your email",
            success:true
        })

        return response
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

