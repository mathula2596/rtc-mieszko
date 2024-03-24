import { connect } from "../../../../db/dbConfig";
import { NextResponse } from "next/server";



connect()

export async function GET() {
    try {
        const response = NextResponse.json({
            message:"logout success",
            success:true
        })
        
        response.cookies.set("token","",{httpOnly:true,expires:new Date(0)})
        
        return response
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}