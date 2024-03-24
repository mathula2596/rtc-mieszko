import { mongoose } from "mongoose";

const notificationTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],
        unique:true,
    },
    user_id:{
        type:String,
        required:[true,"user is required"],
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
    updated_at:{
        type: Date,
        default:Date.now(),
        
    }
},{
    Timestamp:true
})

notificationTokenSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

notificationTokenSchema.pre('updateOne', function (next) {
    this.updateOne({}, { $set: { updated_at: new Date() } });
    next();
});

const NotificationTokenModel = mongoose.models.notificationTokens || mongoose.model("notificationTokens",notificationTokenSchema)

export default NotificationTokenModel