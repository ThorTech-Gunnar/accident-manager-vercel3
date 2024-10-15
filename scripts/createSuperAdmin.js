const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../src/utils/dbSchema');
require('dotenv').config();

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'changeme123';

    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const superAdmin = new User({
      email,
      password: hashedPassword,
      role: 'superadmin',
    });

    await superAdmin.save();

    console.log('Super admin created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Please change the password after first login');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSuperAdmin();