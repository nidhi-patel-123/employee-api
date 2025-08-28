import mongoose from "mongoose";
import {userRegister} from './userSeed.js'

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
         await userRegister()
    } catch (error) {
        console.log(error)
    }
}

export default connectToDatabase