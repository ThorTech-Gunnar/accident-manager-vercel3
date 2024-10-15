import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Case } from '../utils/dbSchema';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

const validateCaseInput = [
  body('title').trim().isLength({ min: 1, max: 255 }).escape(),
  body('description').trim().isLength({ min: 1 }).escape(),
  body('status').isIn(['open', 'in progress', 'closed']),
  body('floorPlanId').optional().isMongoId(),
  body('incidentLocation.x').optional().isFloat({ min: 0, max: 1 }),
  body('incidentLocation.y').optional().isFloat({ min: 0, max: 1 }),
];

router.post('/', isAuthenticated, validateCaseInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newCase = new Case({
      ...req.body,
      franchise: req.user.franchise,
    });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating case', error });
  }
});

router.put('/:id', isAuthenticated, validateCaseInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id, franchise: req.user.franchise },
      req.body,
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating case', error });
  }
});

// ... (other routes)

export default router;