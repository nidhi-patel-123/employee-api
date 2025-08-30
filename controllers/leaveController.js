// import path from "path"
// import Employee from "../models/Employee.js"
// import Leave from "../models/Leave.js"

// const addLeave = async (req, res) => {
//   try {
//     const { userId, leaveType, startDate, endDate, reason } = req.body
//     const employee = await Employee.findOne({ userId })

//     console.log("leave")
//     const newLeave = new Leave({
//       employeeId: employee._id, leaveType, startDate, endDate, reason
//     })
//     await newLeave.save()

//     return res.status(200).json({ success: true })

//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: "leave add server error" })
//   }
// }

// const getLeave = async (req, res) => {
//   try {
//     const { id,role } = req.params;
//     let leaves
//     if(role === "admin") {
//       leaves = await Leave.find({employeeId:id})
//     } else{
//     // if(!leaves || leaves.length === 0){
//       const employee = await Employee.findOne({ userId: id })
//       leaves = await Leave.find({ employeeId: employee._id })
//     }
//       return res.status(200).json({ success: true, leaves })
//     } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: "leave add server error" })
//   }
// }

// const getLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find().populate({
//       path: "employeeId",
//       populate: [
//         {
//           path: 'department',
//           select: 'dep_name'
//         },
//         {
//           path: 'userId',
//           select: 'name'
//         }
//       ]
//     })

//     return res.status(200).json({ success: true, leaves })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: "leave add server error" })
//   }
// }

// const getLeaveDetail = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const leave = await Leave.findById({ _id: id }).populate({
//       path: "employeeId",
//       populate: [
//         {
//           path: 'department',
//           select: 'dep_name'
//         },
//         {
//           path: 'userId',
//           select: 'name profileImage'
//         }
//       ]
//     })

//     return res.status(200).json({ success: true, leave })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: "leave detail server error" })
//   }
// }

// const updateLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(req.body.status)
//     const leave = await Leave.findByIdAndUpdate({ _id: id }, { status: req.body.status })
//     if (!leave) {
//       return res.status(404).json({ success: false, error: "leave not founded" })
//     }
//     return res.status(200).json({ success: true })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: "leave update server error" })
//   }
// }

// export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave }
// // ================================================================================================



import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import { io } from '../index.js'; // for WebSocket notifications

// 1️⃣ Add Leave (emit notification)
const addLeave = async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;
        const employee = await Employee.findOne({ userId });

        const newLeave = new Leave({
            employeeId: employee._id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        await newLeave.save();

        // WebSocket notification
        io.emit('newLeaveNotification', {
            title: 'New Leave Request',
            message: `${employee.userId.name} requested leave from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
            leaveId: newLeave._id,
            employeeId: employee._id,
            status: newLeave.status,
            createdAt: newLeave.appliedAt
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave add server error" });
    }
};

// 2️⃣ Get leave by employee/admin
const getLeave = async (req, res) => {
    try {
        const { id, role } = req.params;
        let leaves;

        if (role === "admin") {
            leaves = await Leave.find().populate({
                path: "employeeId",
                populate: [
                    { path: 'department', select: 'dep_name' },
                    { path: 'userId', select: 'name' }
                ]
            });
        } else {
            const employee = await Employee.findOne({ userId: id });
            leaves = await Leave.find({ employeeId: employee._id });
        }

        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave fetch server error" });
    }
};

// 3️⃣ Get all leaves (admin table)
const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                { path: 'department', select: 'dep_name' },
                { path: 'userId', select: 'name' }
            ]
        });

        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave add server error" });
    }
};

// 4️⃣ Get leave detail
const getLeaveDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findById(id).populate({
            path: "employeeId",
            populate: [
                { path: 'department', select: 'dep_name' },
                { path: 'userId', select: 'name profileImage' }
            ]
        });

        return res.status(200).json({ success: true, leave });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave detail server error" });
    }
};

// 5️⃣ Update leave status
const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findByIdAndUpdate(id, { status: req.body.status });
        if (!leave) {
            return res.status(404).json({ success: false, error: "leave not found" });
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave update server error" });
    }
};

// ✅ Export all defined functions
export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };
