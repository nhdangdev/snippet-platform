import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<void> {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('\nPassword hashed successfully!\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log(`password: "${hash}",\n`);
  } catch (error) {
    console.log("🚀 ~ hashPassword ~ error:", error)
    process.exit(1);
  }
}

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password');
  console.log("🚀 ~ password:", password)
  process.exit(1);
}

hashPassword(password);
