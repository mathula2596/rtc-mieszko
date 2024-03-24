import {connect} from "../../../../../db/dbConfig"
import User from "../../../../../models/userModel"
import { NextResponse } from "next/server"
import bcryptjs  from "bcryptjs";

connect()


export async function GET(request,{params}) {
    try {
        const {id} = params

        const users =  await User.findOne({_id:id}).select("-password")
        return NextResponse.json({
            data:users,
            success:true
        })

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const reqBody = await request.json();
        const { username, email, type, store, isActive, password,name} = reqBody;
        var user = null
        const store_data = JSON.stringify(store)
        if(password!=null){
            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(password,salt)
            
            user = await User.findByIdAndUpdate(id, { username, email, type, store:store_data,isActive,password:hashedPassword,name }, { new: true });
            console.log("Here")
        }else{
            user = await User.findByIdAndUpdate(id, { username, email, type, store:store_data,isActive,name }, { new: true });

        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log(user);

        return NextResponse.json({ message: 'User updated', user, success: true });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



