import mongoose from 'mongoose';
import { PropertyTypes } from './property.enums.js'


const propertyRequestSchema = new mongoose.Schema({
  propertyType: { type: String, enum: PropertyTypes, required: true },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  description: { type: String, required: true },
  refreshedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


propertyRequestSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
  }
});

const PropertyRequest = mongoose.model('PropertyRequest', propertyRequestSchema);
export default PropertyRequest;