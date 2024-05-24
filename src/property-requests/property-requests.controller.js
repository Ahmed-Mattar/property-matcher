import { Router } from 'express';
import * as propertyRequestsService from './property-requests.service.js';
import { authenticate, authorize, checkOwnership } from '../auth/auth.middleware.js';
import PropertyRequest from './property-request.schema.js';
import { validatePropertyRequestCreate } from './property-requests.validator.js'
import { validate } from '../middlewares/validate.js'

const router = Router();


/**
 * @swagger
 * /api/property-requests:
 *   post:
 *     summary: Create a new property request
 *     tags: [Property-Requests]
 *     description: Endpoint to create a new property request by clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 enum: [VILLA, HOUSE, LAND, APARTMENT]
 *               area:
 *                 type: number
 *               price:
 *                 type: number
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', validatePropertyRequestCreate , validate ,authenticate, authorize(['CLIENT']), async (req, res) => {
  try {
    const propertyRequestData = { ...req.body, user: req.user._id };
    const propertyRequest = await propertyRequestsService.create(propertyRequestData);
    res.status(201).json(propertyRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', authenticate, authorize(['CLIENT']), checkOwnership(PropertyRequest), async (req, res) => {
  try {
    const { area, price, description } = req.body;
    const propertyRequest = await propertyRequestsService.update(req.params.id, {area, price, description});
    res.status(200).json(propertyRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/match/:adId', authenticate, async (req, res) => {
  const { page, limit } = req.query;
  try {
    const matchingRequests = await propertyRequestsService.match(req.params.adId, parseInt(page) || 1, parseInt(limit) || 10);
    res.status(200).json(matchingRequests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;