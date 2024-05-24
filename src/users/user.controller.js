import { Router } from 'express';
import * as userService from './user.service.js';
import { authenticate, checkOwnership } from '../auth/auth.middleware.js';
import { validateUserCreate, validateUserUpdate } from './user.validator.js';
import { validate } from '../middlewares/validate.js';

import { generateToken } from '../auth/auth.service.js'
import User from '../users/user.schema.js';


const router = Router();

router.post('/', validateUserCreate, validate, async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    const token = await generateToken(user._id)
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', authenticate, checkOwnership(User), validateUserUpdate, validate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', authenticate, checkOwnership(User), async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      res.status(404).send('User not found')
      return
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, checkOwnership(User), async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
