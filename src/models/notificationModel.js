import { mongoose } from "mongoose";

const notificationSchema = new mongoose.Schema({
    rtc_id:{
        type:String,
        required:[false,"Id is required"],
        unique:false,
    },
    message:{
        type:String,
        required:[true,"message is required"],
        unique:false,
    },
    user_id:{
        type:String,
        required:[true,"user is required"],
        unique:false,
    },
    isRead:[{
        userId: String,
        status: Boolean
    }],
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

notificationSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

notificationSchema.pre('updateOne', function (next) {
    this.updateOne({}, { $set: { updated_at: new Date() } });
    next();
});

const NotificationModel = mongoose.models.notifications || mongoose.model("notifications",notificationSchema)

export default NotificationModel