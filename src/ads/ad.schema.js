import mongoose from 'mongoose';
import { PropertyTypes } from '../property-requests/property.enums.js'

const adSchema = new mongoose.Schema({
  propertyType: { type: String, enum: PropertyTypes, required: true },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

adSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
  }
});

const Ad = mongoose.model('Ad', adSchema);
export default Ad;