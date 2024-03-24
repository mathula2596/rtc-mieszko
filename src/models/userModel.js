import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        unique:false,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
    },
    name:{
        type:String,
        required:[true,"name is required"],
        unique:false,
    },
    type:{
        type:String,
        required:[true,"type is required"],
        unique:false,
    },
    store:{
        type:String,
        required:[true,"store is required"],
        unique:false,
    },
    isActive:{
        type:Boolean,
        required:false,
        default:true,
    },
    created_at:{
        type: Date,
        default:Date.now()
    },
    resetToken:{
        type:String,
        required:false,
    },
    resetExpiry:{
        type:Date,
        required:false,
    },
},{
    Timestamp:true
}
)

const User = mongoose.models.users || mongoose.model("users",userSchema)

export default User