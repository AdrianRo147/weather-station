import { NewRecord, NewUser } from "./definitions";
import bcrypt from 'bcryptjs';

export const recordsSeedData: Array<NewRecord> = [
  {
    temperature: 12,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-01')
  },
  {
    id: 2,
    temperature: 13,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-02')
  },
  {
    id: 3,
    temperature: 15,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-03')
  },
  {
    id: 4,
    temperature: 16,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-04')
  },
  {
    id: 5,
    temperature: 18,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-05')
  },
  {
    id: 6,
    temperature: 20,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-06')
  },
  {
    id: 7,
    temperature: 22,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-07')
  },
  {
    id: 8,
    temperature: 24,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-08')
  },
  {
    id: 9,
    temperature: 26,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-09')
  },
  {
    id: 10,
    temperature: 28,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-10')
  },
  {
    id: 11,
    temperature: 30,
    uploaded_by: 1,
    uploaded_at: new Date('2025-08-11')
  },
];

export const usersSeedData: Array<NewUser> = [
  {
    username: 'admin',
    password: '12345678',
    role: 'admin'
  },
  {
    username: 'user',
    password: '12345678',
    role: 'user'
  }
];
