import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Matching API',
      version: '1.0.0',
      description: 'API documentation for the Property Matching application',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
          },
        },
        UserCreate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string' },
            phone: { type: 'string' },
          },
          required: ['name', 'password', 'phone'],
        },
        UserStats: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
            adsCount: { type: 'integer' },
            totalAdsAmount: { type: 'integer' },
            requestsCount: { type: 'integer' },
            totalRequestsAmount: { type: 'integer' },
          },
        },
        PropertyRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            propertyType: { type: 'string', enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT'] },
            area: { type: 'number' },
            price: { type: 'number' },
            city: { type: 'string' },
            district: { type: 'string' },
            description: { type: 'string' },
            refreshedAt: { type: 'string', format: 'date-time' },
          },
        },
        PropertyRequestCreate: {
          type: 'object',
          properties: {
            propertyType: { type: 'string', enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT'] },
            area: { type: 'number' },
            price: { type: 'number' },
            city: { type: 'string' },
            district: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['propertyType', 'area', 'price', 'city', 'district', 'description'],
        },
      },
    },
    security: [{
      BearerAuth: []
    }],
  },
  apis: ['./src/**/*.controller.js'],
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}