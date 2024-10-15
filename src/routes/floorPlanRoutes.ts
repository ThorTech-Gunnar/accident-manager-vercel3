import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '../utils/dbSchema';
import { isAuthenticated, isAdminOrSuperAdmin } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/floor-plans');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', isAuthenticated, isAdminOrSuperAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newFloorPlan = new FloorPlan({
      name: req.body.name,
      imageUrl: `/uploads/floor-plans/${req.file.filename}`,
      franchise: req.user.franchise,
    });

    await newFloorPlan.save();
    res.status(201).json(newFloorPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading floor plan', error });
  }
});

// ... (other routes)

export default router;