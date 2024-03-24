import { connect } from "../../../db/dbConfig";
import {NextResponse } from "next/server";
import { getDataFromToken} from "../../../helpers/getDataFromToken";
import NotificationTokenModel from "../../../models/notificationTokenModel";

connect()



export async function POST(request) {
    try {
        const reqBody = await request.json()
        const { token} = reqBody
        console.log(reqBody)
        const userID = await getDataFromToken(request)
        // console.log(store)
        const currentToken = await NotificationTokenModel.find({user_id:userID,isActive:true,token:token})
        console.log(currentToken)
        if(currentToken=="")
        {
            const newDevice = new NotificationTokenModel({
                token,
                user_id:userID,
                isActive:true,
            })
    
            const savedDevice = await newDevice.save()
            return NextResponse.json({message:"New Token Record Created!",savedDevice:savedDevice,success:true})

        }
        return NextResponse.json({message:"No need!",success:true})

        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

