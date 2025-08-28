// import User  from './models/User.js'
// import bcrypt from 'bcrypt'
// import connectToDatabase from './db/db.js'

// const userRegister = async () => {
//     connectToDatabase()
//     try {
//         const hashPassword = await bcrypt.hash("admin" , 10)
//         const newUser = new User({
//             name: "Admin",
//             email: "admin@gmail.com",
//             password: hashPassword,
//             role:  "admin" 
//         })
//         await newUser.save()
//     } catch (error) {
//         console.log(error)
//     }
// }

// userRegister();
import User from './models/User.js'
import bcrypt from 'bcrypt'

export const userRegister = async () => {
    try {
        // पहले check करो कि admin user पहले से तो नहीं है
        const existingUser = await User.findOne({ email: "admin@gmail.com" })
        if (existingUser) {
            console.log("✅ Admin user already exists")
            return
        }

        // password hash
        const hashPassword = await bcrypt.hash("admin", 10)

        // नया admin बनाओ
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        })

        await newUser.save()
        console.log("🎉 Admin user created successfully")
    } catch (error) {
        console.log("❌ Error seeding admin:", error.message)
    }
}
