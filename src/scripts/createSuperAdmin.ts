import { connectToMemoryDB, disconnectFromMemoryDB } from '../utils/mongoMemoryServer';
import { User } from '../utils/dbSchema';
import { hashPassword } from '../utils/auth';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await connectToMemoryDB();

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      console.error('Super admin email or password not provided in environment variables');
      process.exit(1);
    }

    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    const hashedPassword = await hashPassword(superAdminPassword);

    const superAdmin = new User({
      email: superAdminEmail,
      password: hashedPassword,
      role: 'superadmin',
    });

    await superAdmin.save();

    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  } finally {
    await disconnectFromMemoryDB();
  }
};

createSuperAdmin();