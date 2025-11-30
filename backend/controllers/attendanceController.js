const Attendance = require('../models/Attendance');
const User = require('../models/User');

// EMPLOYEE ENDPOINTS

exports.checkIn = async (req, res) => {
  try {
    const { notes } = req.body;
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: tomorrowStart },
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = new Attendance({
        userId,
        date: today,
      });
    }

    attendance.checkInTime = new Date();
    attendance.status = 'present';
    attendance.notes = notes || '';

    await attendance.save();

    res.status(201).json({
      message: 'Checked in successfully',
      attendance: {
        id: attendance._id,
        checkInTime: attendance.checkInTime,
        status: attendance.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { notes } = req.body;
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: tomorrowStart },
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in found for today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOutTime = new Date();
    if (notes) attendance.notes = notes;

    await attendance.save();

    res.json({
      message: 'Checked out successfully',
      attendance: {
        id: attendance._id,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        totalHours: attendance.totalHours,
        status: attendance.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const { month, year, limit = 30, page = 1 } = req.query;
    const userId = req.user.id;

    let query = { userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const skip = (page - 1) * limit;

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Attendance.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      onLeave: 0,
      totalHours: 0,
    };

    attendance.forEach((record) => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      else if (record.status === 'on-leave') summary.onLeave++;

      summary.totalHours += record.totalHours || 0;
    });

    res.json({
      month: currentMonth,
      year: currentYear,
      summary,
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: tomorrowStart },
    });

    if (!attendance) {
      return res.json({
        isCheckedIn: false,
        checkInTime: null,
        checkOutTime: null,
        status: 'absent',
      });
    }

    res.json({
      isCheckedIn: !!attendance.checkInTime,
      isCheckedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      totalHours: attendance.totalHours,
      status: attendance.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MANAGER ENDPOINTS

exports.getAllEmployees = async (req, res) => {
  try {
    const { department, status, date, limit = 50, page = 1 } = req.query;

    let query = { role: 'employee' };
    if (department) query.department = department;

    const skip = (page - 1) * limit;

    const employees = await User.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password');

    const total = await User.countDocuments(query);

    // If date filter, fetch attendance for that date
    let attendanceMap = {};
    if (date) {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const attendanceRecords = await Attendance.find({
        date: { $gte: filterDate, $lt: nextDay },
        ...(status && { status }),
      });

      attendanceRecords.forEach((record) => {
        attendanceMap[record.userId.toString()] = record;
      });
    }

    const employeesWithAttendance = employees.map((emp) => ({
      ...emp.toObject(),
      todayAttendance: attendanceMap[emp._id.toString()] || null,
    }));

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      employees: employeesWithAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, limit = 30, page = 1 } = req.query;

    let query = { userId: id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const skip = (page - 1) * limit;

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const user = await User.findById(id);

    const total = await Attendance.countDocuments(query);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        department: user.department,
      },
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate('userId', 'name employeeId department');

    // Group by status
    const summary = {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      onLeave: 0,
      byDepartment: {},
    };

    // Group by department
    const departments = {};

    attendance.forEach((record) => {
      summary.total++;
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      else if (record.status === 'on-leave') summary.onLeave++;

      const dept = record.userId?.department || 'Unknown';
      if (!departments[dept]) {
        departments[dept] = {
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0,
          total: 0,
        };
      }

      departments[dept].total++;
      if (record.status === 'present') departments[dept].present++;
      else if (record.status === 'absent') departments[dept].absent++;
      else if (record.status === 'late') departments[dept].late++;
      else if (record.status === 'half-day') departments[dept].halfDay++;
    });

    summary.byDepartment = departments;

    res.json({
      month: currentMonth,
      year: currentYear,
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrowStart },
    }).populate('userId', 'name employeeId department email');

    const summary = {
      present: [],
      absent: [],
      late: [],
      total: 0,
    };

    // Get all employees
    const allEmployees = await User.find({ role: 'employee' });
    const attendanceMap = {};

    attendance.forEach((record) => {
      attendanceMap[record.userId._id.toString()] = record;
      if (record.status === 'present') summary.present.push(record.userId);
      else if (record.status === 'late') summary.late.push(record.userId);
    });

    // Find absent employees
    allEmployees.forEach((emp) => {
      if (!attendanceMap[emp._id.toString()]) {
        summary.absent.push({
          _id: emp._id,
          name: emp.name,
          employeeId: emp.employeeId,
          department: emp.department,
          email: emp.email,
        });
      }
    });

    summary.total = allEmployees.length;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (employeeId) {
      query.userId = employeeId;
    }

    const records = await Attendance.find(query)
      .populate('userId', 'name employeeId department email')
      .sort({ date: 1 });

    // Format CSV
    let csv = 'Employee Name,Employee ID,Department,Date,Check In,Check Out,Total Hours,Status\n';

    records.forEach((record) => {
      const checkIn = record.checkInTime
        ? new Date(record.checkInTime).toLocaleString()
        : 'N/A';
      const checkOut = record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleString()
        : 'N/A';
      const date = new Date(record.date).toISOString().split('T')[0];

      csv += `"${record.userId?.name || 'Unknown'}","${record.userId?.employeeId || 'N/A'}","${record.userId?.department || 'N/A'}","${date}","${checkIn}","${checkOut}",${record.totalHours.toFixed(2)},"${record.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
