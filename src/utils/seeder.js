import dotenv from 'dotenv'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import User from '../models/User.js';
import { FinancialRecord } from '../models/FinancialRecord.js';

dotenv.config()

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected for seeding...');
};

const users = [
  { name: 'Admin User', email: 'admin@finance.com', password: 'admin123', role: 'admin' },
  { name: 'Alice Analyst', email: 'analyst@finance.com', password: 'analyst123', role: 'analyst' },
  { name: 'Victor Viewer', email: 'viewer@finance.com', password: 'viewer123', role: 'viewer' },
];

const generateRecords = (adminId) => {
  const categories = ['salary', 'freelance', 'investment', 'rent', 'utilities', 'food', 'travel', 'marketing', 'healthcare', 'entertainment'];
  const records = [];

  // Generate 6 months of data
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - month);

    // Income records
    records.push({
      title: 'Monthly Salary',
      amount: 5000 + Math.floor(Math.random() * 500),
      type: 'income',
      category: 'salary',
      date: new Date(date.getFullYear(), date.getMonth(), 1),
      notes: `Salary for ${date.toLocaleString('default', { month: 'long' })}`,
      createdBy: adminId,
    });

    records.push({
      title: 'Freelance Project',
      amount: 800 + Math.floor(Math.random() * 400),
      type: 'income',
      category: 'freelance',
      date: new Date(date.getFullYear(), date.getMonth(), 10),
      notes: 'Client project payment',
      createdBy: adminId,
    });

    records.push({
      title: 'Investment Returns',
      amount: 200 + Math.floor(Math.random() * 300),
      type: 'income',
      category: 'investment',
      date: new Date(date.getFullYear(), date.getMonth(), 15),
      createdBy: adminId,
    });

    // Expense records
    records.push({
      title: 'Office Rent',
      amount: 1200,
      type: 'expense',
      category: 'rent',
      date: new Date(date.getFullYear(), date.getMonth(), 5),
      notes: 'Monthly office rent',
      createdBy: adminId,
    });

    records.push({
      title: 'Electricity Bill',
      amount: 80 + Math.floor(Math.random() * 40),
      type: 'expense',
      category: 'utilities',
      date: new Date(date.getFullYear(), date.getMonth(), 7),
      createdBy: adminId,
    });

    records.push({
      title: 'Team Lunch',
      amount: 120 + Math.floor(Math.random() * 80),
      type: 'expense',
      category: 'food',
      date: new Date(date.getFullYear(), date.getMonth(), 20),
      createdBy: adminId,
    });

    records.push({
      title: 'Marketing Campaign',
      amount: 300 + Math.floor(Math.random() * 200),
      type: 'expense',
      category: 'marketing',
      date: new Date(date.getFullYear(), date.getMonth(), 12),
      createdBy: adminId,
    });
  }

  return records;
};

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    console.log(`Created ${createdUsers.length} users.`);

    // Create financial records
    const records = generateRecords(adminUser._id);
    await FinancialRecord.insertMany(records);
    console.log(`Created ${records.length} financial records.`);

    console.log('\n========== SEED COMPLETE ==========');
    console.log('Demo credentials:');
    console.log('  Admin   → admin@finance.com    / admin123');
    console.log('  Analyst → analyst@finance.com  / analyst123');
    console.log('  Viewer  → viewer@finance.com   / viewer123');
    console.log('=====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();