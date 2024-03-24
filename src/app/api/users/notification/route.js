import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

import { getUser } from "../../../../helpers/getDataFromToken";
import NotificationModel from "@/models/notificationModel";


connect()

export async function GET(request) {
    try {
        const userId = await getUser(request);
       
        const notifications = await NotificationModel.find({
            user_id: { $regex: userId._id },
            isRead: { $elemMatch: { userId: userId._id, status: false } }
        }).select();


        return NextResponse.json({
            data: notifications,
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const userId = await getUser(request);
        const filter = { user_id: { $regex: userId._id } };
        const update = { $set: { "isRead.$[elem].status": true } };
        const options = { arrayFilters: [{ "elem.userId": userId._id, "elem.status": false }] };

        const notifications = await NotificationModel.updateMany(filter, update, options);

        console.log(notifications);

        return NextResponse.json({
            data: notifications,
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
