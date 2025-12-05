import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Company from '../models/Company.js';
import { hashPassword } from '../utils/Auth.js';

dotenv.config();

async function run() {
  const mongo = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentproof_dev';
  await mongoose.connect(mongo, { autoIndex: true });

  const email = `test+${Date.now()}@example.com`;
  const passwordPlain = 'Password123!';
  const hashed = await hashPassword(passwordPlain);

  const existing = await Company.findOne({ email });
  if (existing) {
    await mongoose.disconnect();
    return;
  }

  const company = await Company.create({
    nom: 'TestCompany',
    email,
    password: hashed,
    isConfirmed: true,
  });

  await mongoose.disconnect();
}

run().catch(err => {
  process.exit(1);
});
