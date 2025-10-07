import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const password = 'password';

  // Generate NEW hash
  const newHash = await bcrypt.hash(password, 10);

  // Test old hash
  const oldHash = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u';
  const oldMatch = await bcrypt.compare(password, oldHash);

  // Test new hash
  const newMatch = await bcrypt.compare(password, newHash);

  return NextResponse.json({
    password,
    oldHash: {
      hash: oldHash,
      matches: oldMatch,
      status: oldMatch ? '✅' : '❌'
    },
    newHash: {
      hash: newHash,
      matches: newMatch,
      status: newMatch ? '✅' : '❌'
    },
    message: 'Use the NEW hash in auth.ts!'
  });
}
