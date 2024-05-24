import { body } from 'express-validator';

export const validateUserCreate = [
  body('name').notEmpty().withMessage('name is required'),
  body('password').notEmpty().withMessage('password is required'),
  body('phone').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Invalid phone number'),
  body('role').optional().isEmpty().withMessage('Role cannot be included'),
  body('status').optional().isEmpty().withMessage('Status cannot be included')
];

export const validateUserUpdate = [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('phone').optional().notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Invalid phone number'),
  body('role').optional().isEmpty().withMessage('Role cannot be included'),
  body('status').optional().isEmpty().withMessage('Status cannot be included')
];

