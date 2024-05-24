import config from './config/config.js';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import { requestLogger } from './middlewares/logger.js';
import setupSwagger from './swagger.js';


const app = express();

app.use(requestLogger);

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
// Set up Swagger documentation
setupSwagger(app);

// MongoDB connection
mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;