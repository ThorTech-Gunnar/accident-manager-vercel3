import express from 'express';
import { Franchise, User } from '../utils/dbSchema';
import { hashPassword } from '../utils/auth';
import { isAuthenticated, isSuperAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create', isAuthenticated, isSuperAdmin, async (req, res) => {
  try {
    const { name, adminEmail, adminPassword, subscriptionEndDate, paymentMethod } = req.body;

    const franchise = new Franchise({
      name,
      subscriptionStatus: 'active',
      subscriptionEndDate,
      paymentMethod,
    });

    await franchise.save();

    const adminUser = new User({
      email: adminEmail,
      password: await hashPassword(adminPassword),
      role: 'admin',
      franchise: franchise._id,
    });

    await adminUser.save();

    res.status(201).json({ message: 'Franchise created successfully', franchiseId: franchise._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating franchise', error });
  }
});

router.get('/list', isAuthenticated, isSuperAdmin, async (req, res) => {
  try {
    const franchises = await Franchise.find({});
    res.json(franchises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching franchises', error });
  }
});

export default router;