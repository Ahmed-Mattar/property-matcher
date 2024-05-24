import cron from 'node-cron';
import mongoose from 'mongoose';
import PropertyRequest from './src/property-requests/property-request.schema.js';

mongoose.connect('mongodb://localhost:27017/property-matcher', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

cron.schedule('0 0 */3 * *', async () => {
    try {
        console.log('Refreshing property requests...');

        const currentDate = new Date();
        await PropertyRequest.updateMany({}, { refreshedAt: currentDate });

        console.log('Property requests refreshed successfully');
    } catch (error) {
        console.error('Error refreshing property requests:', error);
    }
}, {
    scheduled: true,
    timezone: 'UTC' 
});