// import express from 'express'
// import cors from 'cors'
// import authRouter from './routes/auth.js'
// import departmentRouter from './routes/department.js'
// import employeeRouter from './routes/employee.js'
// import salaryRouter from  './routes/salary.js'
// import leaveRouter from './routes/leave.js'
// import settingRouter from './routes/setting.js'
// import dashboardRouter from './routes/dashboard.js'
// import connectToDatabase from './db/db.js'
// import {userRegister} from './userSeed.js'/

// connectToDatabase()

// const app = express()
// app.use(cors({
//     origin:"https://employee-frontend-jade-iota.vercel.app",
//     credentials:true
// }))
// app.use(cors())
// app.use(express.json())
// app.use(express.static('public/uploads'))
// app.use('/api/auth', authRouter)
// app.use('/api/department', departmentRouter)
// app.use('/api/employee', employeeRouter)
// app.use('/api/salary', salaryRouter)
// app.use('/api/leave', leaveRouter)
// app.use('/api/setting', settingRouter)
// app.use('/api/dashboard', dashboardRouter)


// app.listen(process.env.PORT, () => {
//     console.log(`Server is Running on port ${process.env.PORT}`)
// })

// -----------------------------------------------------------------------------------------------------------------------
// import express from 'express'
// import cors from 'cors'
// import authRouter from './routes/auth.js'
// import departmentRouter from './routes/department.js'
// import employeeRouter from './routes/employee.js'
// import salaryRouter from './routes/salary.js'
// import leaveRouter from './routes/leave.js'
// import settingRouter from './routes/setting.js'
// import dashboardRouter from './routes/dashboard.js'
// import connectToDatabase from './db/db.js'
// import { userRegister } from './userSeed.js'   

// const app = express()


// connectToDatabase().then(async () => {
//     console.log("✅ Database Connected")
//     await userRegister()   
// })

// app.use(cors({
//     origin: "https://employee-frontend-jade-iota.vercel.app",
//     credentials: true
// }))
// app.use(express.json())
// app.use(express.static('public/uploads'))


// app.use('/api/auth', authRouter)
// app.use('/api/department', departmentRouter)
// app.use('/api/employee', employeeRouter)
// app.use('/api/salary', salaryRouter)
// app.use('/api/leave', leaveRouter)
// app.use('/api/setting', settingRouter)
// app.use('/api/dashboard', dashboardRouter)

// app.listen(process.env.PORT || 5000, () => {
//     console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
// })
// --------------------------------------------------------------------------------------------------------------------------
import express from 'express'
import http from "http";
import { Server } from "socket.io";
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from  './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
import notificationRouter from './routes/notification.js'
import connectToDatabase from './db/db.js'
import { userRegister } from './userSeed.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "https://employee-frontend-jade-iota.vercel.app" }
})

// Attach io to app
app.set("io", io)

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id)

  socket.on("joinAdminRoom", (adminId) => {
    socket.join(adminId)
    console.log(`Admin ${adminId} joined room`)
  })

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id))
})

connectToDatabase().then(async () => {
    console.log("✅ Database Connected")
    await userRegister()
})

app.use(cors({ origin: "https://employee-frontend-jade-iota.vercel.app", credentials: true }))
app.use(express.json())
app.use(express.static('public/uploads'))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', settingRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/notification', notificationRouter)

server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
})
