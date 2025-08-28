import User  from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    connectToDatabase()
    try {
        const hashPassword = await bcrypt.hash("admin" , 10)
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role:  "admin" 
        })
        await newUser.save()
    } catch (error) {
        console.log(error)
    }
}

userRegister();

userSeed.js
// import User from './models/User.js'
// import bcrypt from 'bcrypt'
// import connectToDatabase from './db/db.js'

// const userRegister = async () => {
//     try {
//         // Ensure database is connected
//         await connectToDatabase();

//         // Check if admin already exists
//         const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
//         if (existingAdmin) {
//             console.log("Admin user already exists");
//             return;
//         }

//         // Hash the password
//         const hashPassword = await bcrypt.hash("admin", 10);

//         // Create new admin user
//         const newUser = new User({
//             name: "Admin",
//             email: "admin@gmail.com",
//             password: hashPassword,
//             role: "admin"
//         });

//         await newUser.save();
//         console.log("Admin user created successfully");
//     } catch (error) {
//         console.error("Error creating admin user:", error);
//     }
// };

//  userRegister;
