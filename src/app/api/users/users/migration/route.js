import {connect} from "../../../../../db/dbConfig"
import User from "../../../../../models/userModel"
import { NextResponse } from "next/server"
import bcryptjs  from "bcryptjs";

connect()

export async function GET() {
    try {

        const username = "SuperAdmin"
        const email = "default@gmail.com"
        const password = "123456"
        const type = "Super"
        const store = ["All"]
        const name = username

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)

        const store_data = JSON.stringify(store)

        const newUser = new User({
            name,
            username,
            email,
            password:hashedPassword,
            type,
            store:store_data
        })

        const savedUser = await newUser.save()

        return NextResponse.json({message:"migrated",savedUser:savedUser,success:true})
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}






