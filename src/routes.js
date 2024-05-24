import { Router } from 'express';
import propertyRequestsController from './property-requests/property-requests.controller.js';
import adsController from './ads/ads.controller.js';
import adminController from './admin/admin.controller.js';
import authController from './auth/auth.controller.js';
import userController from './users/user.controller.js';

const router = Router();

router.use('/auth', authController);
router.use('/users', userController);
router.use('/property-requests', propertyRequestsController);
router.use('/ads', adsController);
router.use('/admin', adminController);

export default router;