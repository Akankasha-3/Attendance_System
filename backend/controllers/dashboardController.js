const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // Get today's attendance
    const todayAttendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: tomorrowStart },
    });

    // Get current month
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0);

    // Get monthly summary
    const monthlyAttendance = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const monthlySummary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    monthlyAttendance.forEach((record) => {
      if (record.status === 'present') monthlySummary.present++;
      else if (record.status === 'absent') monthlySummary.absent++;
      else if (record.status === 'late') monthlySummary.late++;
      else if (record.status === 'half-day') monthlySummary.halfDay++;
      monthlySummary.totalHours += record.totalHours || 0;
    });

    // Get last 7 days attendance
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttendance = await Attendance.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: monthEnd },
    }).sort({ date: -1 });

    // Get user info
    const user = await User.findById(userId);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        email: user.email,
        department: user.department,
      },
      today: {
        isCheckedIn: !!todayAttendance?.checkInTime,
        isCheckedOut: !!todayAttendance?.checkOutTime,
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'not-marked',
      },
      monthly: monthlySummary,
      recentAttendance: recentAttendance.slice(0, 7),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getManagerDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrowStart },
    }).populate('userId', 'name employeeId department email');

    let presentCount = 0;
    let lateCount = 0;
    const absentList = [];

    const attendanceMap = {};

    todayAttendance.forEach((record) => {
      attendanceMap[record.userId._id.toString()] = record;
      if (record.status === 'present') presentCount++;
      if (record.status === 'late') lateCount++;
    });

    const absentCount = totalEmployees - presentCount - lateCount;

    // Find absent employees
    const allEmployees = await User.find({ role: 'employee' });
    allEmployees.forEach((emp) => {
      if (!attendanceMap[emp._id.toString()]) {
        absentList.push({
          id: emp._id,
          name: emp.name,
          employeeId: emp.employeeId,
          department: emp.department,
          email: emp.email,
        });
      }
    });

    // Weekly attendance trend (last 7 days)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayAttendance = await Attendance.find({
        date: { $gte: date, $lt: nextDate },
      });

      weeklyData.push({
        date: date.toISOString().split('T')[0],
        count: dayAttendance.length,
      });
    }

    // Department-wise attendance
    const departmentStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrowStart },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$user.department', 0] },
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0],
            },
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    res.json({
      overview: {
        totalEmployees,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
      },
      today: {
        presentCount,
        absentCount,
        lateCount,
        absentList: absentList.slice(0, 10),
      },
      weeklyTrend: weeklyData,
      departmentStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
