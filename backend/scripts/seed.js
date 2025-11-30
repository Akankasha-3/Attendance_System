require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Manager',
        email: 'manager@company.com',
        password: 'password123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Management',
        phone: '9876543210',
      },
      {
        name: 'Alice Johnson',
        email: 'alice@company.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'IT',
        phone: '9123456789',
      },
      {
        name: 'Bob Smith',
        email: 'bob@company.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'IT',
        phone: '9234567890',
      },
      {
        name: 'Carol White',
        email: 'carol@company.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'HR',
        phone: '9345678901',
      },
      {
        name: 'David Brown',
        email: 'david@company.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP004',
        department: 'Sales',
        phone: '9456789012',
      },
      {
        name: 'Eva Martinez',
        email: 'eva@company.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP005',
        department: 'Finance',
        phone: '9567890123',
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample attendance records
    const attendanceRecords = [];
    const today = new Date();

    // Create last 30 days of attendance for each employee
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      // Create attendance for each employee
      for (let i = 1; i < users.length; i++) {
        const employee = users[i];

        // Randomly determine status
        const random = Math.random();
        let status, checkInTime, checkOutTime, totalHours;

        if (random < 0.05) {
          // 5% absent
          status = 'absent';
          checkInTime = null;
          checkOutTime = null;
          totalHours = 0;
        } else if (random < 0.1) {
          // 5% late
          status = 'late';
          checkInTime = new Date(date);
          checkInTime.setHours(9, 30, 0, 0);
          checkOutTime = new Date(date);
          checkOutTime.setHours(17, 30, 0, 0);
          totalHours = 8;
        } else if (random < 0.15) {
          // 5% half-day
          status = 'half-day';
          checkInTime = new Date(date);
          checkInTime.setHours(9, 0, 0, 0);
          checkOutTime = new Date(date);
          checkOutTime.setHours(13, 0, 0, 0);
          totalHours = 4;
        } else {
          // 85% present
          status = 'present';
          checkInTime = new Date(date);
          checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);
          checkOutTime = new Date(date);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);
          const diffMs = checkOutTime - checkInTime;
          totalHours = diffMs / (1000 * 60 * 60);
        }

        attendanceRecords.push({
          userId: employee._id,
          date,
          checkInTime,
          checkOutTime,
          status,
          totalHours: totalHours || 0,
          notes: status === 'half-day' ? 'Half day' : '',
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
