import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"

export const getDataFromToken = (request) =>{
    try {
        const token = request.cookies.get('token')?.value || ''
        const decodedToken = jwt.verify(token,process.env.TOKEN_SECRET)
        return decodedToken.id

    } catch (error) {
        throw new error(error.message)
    }
}

export const getUserType = async (request) =>{
    try {
        const _id = await getDataFromToken(request)
        // console.log(_id)
        const user = await User.findOne({_id}).select('type')
        // console.log(user.type)
        return user.type

    } catch (error) {
        throw new error(error.message)
    }
}

export const getUserStore = async (request) =>{
    try {
        const _id = await getDataFromToken(request)
        const user = await User.findOne({_id}).select('store')
        // console.log(user.store)
        return JSON.parse(user.store)[0]

    } catch (error) {
        throw new error(error.message)
    }
}
export const getUserStores = async (request) =>{
    try {
        const _id = await getDataFromToken(request)
        const user = await User.findOne({_id}).select('store')
        // console.log(user.store)
        return JSON.parse(user.store)

    } catch (error) {
        throw new error(error.message)
    }
}

export const getUser = async (request) =>{
    try {
        const _id = await getDataFromToken(request)
        const user = await User.findOne({_id})
        // console.log(user._id)
        return user

    } catch (error) {
        throw new error(error)
    }
}

