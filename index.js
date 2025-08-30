// // import express from 'express'
// // import cors from 'cors'
// // import authRouter from './routes/auth.js'
// // import departmentRouter from './routes/department.js'
// // import employeeRouter from './routes/employee.js'
// // import salaryRouter from  './routes/salary.js'
// // import leaveRouter from './routes/leave.js'
// // import settingRouter from './routes/setting.js'
// // import dashboardRouter from './routes/dashboard.js'
// // import connectToDatabase from './db/db.js'
// // import {userRegister} from './userSeed.js'/

// // connectToDatabase()

// // const app = express()
// // app.use(cors({
// //     origin:"https://employee-frontend-jade-iota.vercel.app",
// //     credentials:true
// // }))
// // app.use(cors())
// // app.use(express.json())
// // app.use(express.static('public/uploads'))
// // app.use('/api/auth', authRouter)
// // app.use('/api/department', departmentRouter)
// // app.use('/api/employee', employeeRouter)
// // app.use('/api/salary', salaryRouter)
// // app.use('/api/leave', leaveRouter)
// // app.use('/api/setting', settingRouter)
// // app.use('/api/dashboard', dashboardRouter)


// // app.listen(process.env.PORT, () => {
// //     console.log(`Server is Running on port ${process.env.PORT}`)
// // })

// // -----------------------------------------------------------------------------------------------------------------------
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
// // --------------------------------------------------------------------------------------------------------------------


import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
import notificationsRouter from './routes/notification.js'
import connectToDatabase from './db/db.js'
import { userRegister } from './userSeed.js'

const app = express()
const server = http.createServer(app)

// 🔑 Allow both websocket + polling (for fallback)
const io = new Server(server, {
  cors: {
    origin: "https://employee-frontend-jade-iota.vercel.app", // frontend domain
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"]
})

// Middleware to attach io
app.use((req, res, next) => {
  req.io = io
  next()
})

// Database connect
connectToDatabase()
  .then(async () => {
    console.log("✅ Database Connected")
    await userRegister()
  })
  .catch(err => console.log("❌ DB Connection Error:", err))

// Middlewares
app.use(cors({
  origin: "https://employee-frontend-jade-iota.vercel.app",
  credentials: true
}))
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
app.use('/api/notifications', notificationsRouter)

// Socket.IO events
io.on('connection', (socket) => {
  console.log("⚡ Client connected:", socket.id)

  // Example: listen for new notification
  socket.on("sendNotification", (data) => {
    console.log("📢 New notification:", data)
    io.emit("newNotification", data) // broadcast to all clients
  })

  socket.on('disconnect', () => {
    console.log("❌ Client disconnected:", socket.id)
  })
})

// Server start
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})


