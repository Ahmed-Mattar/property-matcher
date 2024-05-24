import { Router } from 'express';
import * as adsService from './ads.service.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { validate } from '../middlewares/validate.js'
import { validateAdCreate } from './ads.validator.js'
import Ad from './ad.schema.js'

const router = Router();

router.post('/', validateAdCreate, validate , authenticate, authorize(['AGENT']), async (req, res) => {
  try {
    const adData = { ...req.body, user: req.user._id };
    const ad = await adsService.create(adData);
    res.status(201).json(ad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
