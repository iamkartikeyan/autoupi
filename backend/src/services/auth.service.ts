import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { mockDb } from './mockDb';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(phone: string, otp: string): Promise<void> {
  // In production: use Twilio
  // For demo/dev: just log it
  console.log(`📱 OTP for ${phone}: ${otp}`);

  const isDemoMode = process.env.DEMO_MODE === 'true';
  if (!isDemoMode && process.env.TWILIO_ACCOUNT_SID) {
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilio.messages.create({
      body: `Your AutoUPI OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }
}

export async function requestOTP(phone: string, email: string) {
  // MOCK: By-pass Supabase completely
  console.log(`📱 MOCK OTP for ${phone}: 123456`);
  return {
    isNewUser: false,
    message: 'Demo OTP: 123456',
  };
}

export async function verifyOTPAndLogin(phone: string, email: string, fullName: string, otp: string) {
  // MOCK FLOW: By-pass Supabase database entirely
  if (otp !== '123456') throw new Error('Invalid OTP (use 123456 in demo)');

  const user = {
    id: 'demo-user-1234',
    phone,
    email: email || `${phone}@autoupi.demo`,
    full_name: fullName || 'Demo User',
    role: 'USER',
    kyc_status: 'VERIFIED',
    wallet_balance: mockDb.balance,
  };

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret',
    { expiresIn: (process.env.JWT_EXPIRY || '7d') as any }
  );

  return { token, user };
}

export async function getUserById(id: string) {
  return {
    id,
    phone: '+911234567890',
    email: 'demo@autoupi.demo',
    full_name: 'Demo User',
    role: 'USER',
    kyc_status: 'VERIFIED',
    wallet_balance: mockDb.balance,
  };
}

// ─── Password-based Auth ─────────────────────────────────────────────────────

export async function registerWithPassword(
  phone: string,
  email: string,
  fullName: string,
  password: string
) {
  // Check if user already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .single();

  if (existing) throw new Error('An account with this phone number already exists. Please sign in.');

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      id: uuidv4(),
      phone,
      email: email || `${phone.replace('+', '')}@autoupi.demo`,
      full_name: fullName,
      role: 'USER',
      kyc_status: 'VERIFIED',
      wallet_balance: 50000,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) throw new Error('Failed to create account. Please try again.');

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRY || '7d') as any }
  );

  return { token, user: newUser };
}

export async function loginWithPassword(phone: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error || !user) throw new Error('No account found with this phone number.');
  if (!user.password_hash) throw new Error('This account uses OTP login. Please use OTP instead.');

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error('Incorrect password. Please try again.');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRY || '7d') as any }
  );

  return { token, user };
}
