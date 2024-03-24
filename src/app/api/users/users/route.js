import {connect} from "../../../../db/dbConfig"
import User from "../../../../models/userModel"
import { NextResponse } from "next/server"
import bcryptjs  from "bcryptjs";

connect()

export async function POST(request) {
    try {
        const reqBody = await request.json()
        const {username,email,password,type,store,name} = reqBody
        console.log(reqBody)

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error:"user already exist"})
        }

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

        console.log(savedUser);

        return NextResponse.json({message:"new user created",user:savedUser,success:true})
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function GET() {
    try {
        const users =  await User.find({})
        return NextResponse.json({
            data:users,
            success:true
        })

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}




