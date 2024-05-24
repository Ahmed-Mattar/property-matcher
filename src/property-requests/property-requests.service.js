import PropertyRequest from './property-request.schema.js';
import Ad from '../ads/ad.schema.js';

export async function create(requestData) {
  const propertyRequest = new PropertyRequest(requestData);
  return await propertyRequest.save();
}

export async function update(requestId, updateData) {
  return await PropertyRequest.findByIdAndUpdate(requestId, updateData, { new: true });
}

export async function match(adId, page = 1, limit = 10) {
  const ad = await Ad.findById(adId);

  if (!ad) {
    throw new Error('Ad not found');
  }


  const priceTolerance = ad.price * 0.1;
  const minPrice = ad.price - priceTolerance;
  const maxPrice = ad.price + priceTolerance;

  const areaTolerance = ad.area * 0.2;
  const minArea = ad.area - areaTolerance;
  const maxArea = ad.area + areaTolerance;

  const matchCriteria = {
    district: ad.district,
    price: { $gte: minPrice, $lte: maxPrice },
    area:  { $gte: minArea, $lte: maxArea }
  };

  const propertyRequests = await PropertyRequest.aggregate([
    { $match: matchCriteria },
    { $sort: { refreshedAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]);

  const total = await PropertyRequest.countDocuments(matchCriteria);

  return {
    data: propertyRequests,
    page,
    limit,
    total,
    hasNextPage: total > page * limit,
    hasPreviousPage: page > 1
  };
}

export async function getAllPropertyRequests() {
  return await PropertyRequest.find();
}