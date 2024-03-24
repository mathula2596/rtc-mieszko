import { connect } from "../../../../db/dbConfig";
import {NextResponse } from "next/server";
import Rtc from "../../../../models/rtcModel";


connect()

export async function GET(request) {
    try {
        const today = new Date();
        const rtcs =  await Rtc.updateMany({isActive:true,expiry: { $lt: today }},{ $set: { isActive: false } })
        return NextResponse.json({
            message:"Deleted Expired",
            data:rtcs,
            success:true
        })
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}



