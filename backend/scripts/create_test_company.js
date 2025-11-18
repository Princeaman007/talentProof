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
    console.log('User already exists:', existing._id.toString());
    await mongoose.disconnect();
    return;
  }

  const company = await Company.create({
    nom: 'TestCompany',
    email,
    password: hashed,
    isConfirmed: true,
  });

  console.log(JSON.stringify({ email, password: passwordPlain, id: company._id }));
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
