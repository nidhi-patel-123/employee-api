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


// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import leaveRouter from "./routes/leave.js";
import notificationRouter from "./routes/notification.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "https://employee-frontend-jade-iota.vercel.app", methods: ["GET", "POST"] },
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/notifications", notificationRouter);

// DB + Server Start
mongoose
  .connect("mongodb://127.0.0.1:27017/ems")
  .then(() => {
    console.log("MongoDB connected");
    server.listen(5000, () => console.log("Server running on 5000"));
  })
  .catch((err) => console.log(err));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("⚡ New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});
