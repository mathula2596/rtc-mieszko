import { connect } from "../../../../db/dbConfig";
import {NextResponse } from "next/server";

import { getUser } from "../../../../helpers/getDataFromToken";


connect()

export async function GET(request) {
    try {
        const user =  await getUser(request)
        // console.log(user)
        return NextResponse.json({
            data:user,
            success:true
        })

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}