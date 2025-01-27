import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {connectionStr} from "@/lib/db"
import {User} from "@/lib/model/users";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs";
import { Agency } from "@/lib/model/agency";
import { uploadBase64Img } from "@/app/helper";
import { MissionCluster } from "@/lib/model/missionCluster";

export async function PUT(request, content) {
    let result = [];
    try {
        const id = content.params.id;
        const filter = {_id: id};
        const payload = await request.json();
        // return NextResponse.json(payload.password);
        await mongoose.connect(connectionStr);
        const missionCluster=await Agency.findById(filter).populate({
            path:'agency_cluster',
            model:'MissionCluster'
        });
        const oldData=missionCluster._doc;
        const record = { agency_email: payload.agency_email, is_delete: 0 };
        const is_findData = await Agency.findOne({
            ...record,
            _id: { $ne: missionCluster._id }
        });

        if (is_findData) {
            return NextResponse.json({ msg: 'Email must be unique', success: false }, { status: 409 });
        }

        if(payload.agency_logo)
        {
            try {
                payload.agency_logo = await uploadBase64Img(payload.agency_logo);
            } catch (e) {
                return NextResponse.json({e, success: 'img upload error found'});
            }
        }
        else
        {
            payload.agency_logo=Agency.agency_email;
        }

        const updatedata={...oldData,...payload}
        result = await Agency.findOneAndUpdate(filter, updatedata);
    } catch (error) {
        return NextResponse.json({error:error.message, success: 'error found'});
    }
    return NextResponse.json({result, success: true});
}

export async function GET(request, content) {
    let result = [];
    try {
        const id = content.params.id;
        const record = {_id: id};
        await mongoose.connect(connectionStr);
        const result = await Agency.findById(record).populate({
            path:'agency_cluster',
            model:'MissionCluster'
        });
        return NextResponse.json({result, success: true});
    } catch (error) {
        result = error;
    }
    return NextResponse.json(result);
}

export async function DELETE(request, content) {
    try {
        const id = content.params.id;
        const filter = { _id: id };

        await mongoose.connect(connectionStr);
        const mission = await Agency.findById(filter);

        // Update only the is_delete field to 1
        mission.is_delete = 1;

        const result = await mission.save();
    } catch (error) {
        return NextResponse.json({ error:error.message, success: false });
    }

    return NextResponse.json({ success: true });
}
