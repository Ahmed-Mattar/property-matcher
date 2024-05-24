import { body } from 'express-validator';
import { PropertyTypes } from '../property-requests/property.enums.js'


export const validateAdCreate = [
    body('propertyType')
        .notEmpty()
        .withMessage('Property type is required')
        .isIn(Object.values(PropertyTypes))
        .withMessage(`Property type must be one of the following: ${Object.values(PropertyTypes).join(', ')}`),
    body('area')
        .notEmpty()
        .withMessage('Area is required')
        .isNumeric()
        .withMessage('Area must be a number')
        .isFloat({ gt: 0 })
        .withMessage('Area must be a positive number'),
    body('description')
        .notEmpty()
        .isString()
        .withMessage('description  is required'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),
    body('city')
        .notEmpty()
        .withMessage('City is required'),
    body('district')
        .notEmpty()
        .withMessage('District is required'),
    body('refreshedAt')
        .optional()
        .isEmpty()
        .withMessage('refreshedAt cannot be included'),
    body('user')
        .optional()
        .isEmpty()
        .withMessage('user cannot be included')
];
