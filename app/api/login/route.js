import {NextResponse} from "next/server";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import {User} from "@/lib/model/users";
import {connectionStr} from "@/lib/db";
import jwt from "jsonwebtoken"

export async function POST(request) {
    try {
        const {name, email, password, user_type} = await (request.json());

        if (!email || !password) {
            return NextResponse.json({message: 'invalid fields'}, {status: 400});
        }
        await mongoose.connect(connectionStr);
        const srcky=process.env.JWT_SECRET
        const record = {email: email};
        const user = await User.findOne(record);
        if (user) {
            if(user.is_delete==1)
            {
                return NextResponse.json({'message': 'Account Already Deleted',success:false}, {status: 401});
            }
            if(user.status==0)
            {
                return NextResponse.json({'message': 'Account Already Blocked',success:false}, {status: 401});
            }
            let id = user.id;
            let is_user = await bcrypt.compare(password, user.password);
            const name=user.name;
            const user_type=user.user_type;
            if (is_user) {
                // let token = jwt.sign({name, email, id,user_type}, srcky,{ expiresIn: '1h' });
                let token = jwt.sign({name, email, id,user_type}, srcky);
                return NextResponse.json({user,message:"Login Successfully", 'token': token}, {status: 200});
            }
        }
    } catch (error) {
        return NextResponse.json(error);
    }
    return NextResponse.json({'message': 'Email or Password is incorrect',success:false}, {status: 401});
}



