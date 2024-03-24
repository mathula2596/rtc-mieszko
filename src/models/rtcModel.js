import { mongoose } from "mongoose";

const rtcSchema = new mongoose.Schema({
    barcode:{
        type:String,
        required:[true,"barcode is required"],
        unique:false,
    },
    name:{
        type:String,
        required:[true,"name is required"],
        unique:false,
    },
    qty:{
        type:Number,
        required:[true,"qty is required"],
        unique:false,
    },
    updatedQty:{
        type:Number,
        required:[false,"updatedQty is required"],
        unique:false,
    },
    expiry:{
        type:Date,
        required:[true,"expiry is required"],
        unique:false,
    },
    price:{
        type:Number,
        required:[false,"price is not required"],
        unique:false,
    },
    approvedPrice:{
        type:Number,
        required:[false,"approvedPrice is not required"],
        unique:false,
    },
    store:{
        type:String,
        required:[true,"store is required"],
        unique:false,
    },
    department:{
        type:String,
        required:[false,"department is required"],
        unique:false,
    },
    verification:{
        type:String,
        required:false,
        default:"Pending",
    },
    count:{
        type:Number,
        required:true,
        default:0,
    },
    userID:{
        type:String,
        required:true,
        default:0,
    },
    isActive:{
        type:Boolean,
        required:false,
        default:true,
    },
    dateCreated:{
        type: Date,
        // default:Date.now()
    },
    priceDate:{
        type: Date,
        // default:Date.now()
    },
    approvedDate:{
        type: Date,
        // default:Date.now()
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

rtcSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

rtcSchema.pre('updateOne', function (next) {
    this.updateOne({}, { $set: { updated_at: new Date() } });
    next();
});

const Rtc = mongoose.models.rtc || mongoose.model("rtc",rtcSchema)

export default Rtc