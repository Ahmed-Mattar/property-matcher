import Ad from './ad.schema.js';

export async function create(adData) {
  const ad = new Ad(adData);
  return await ad.save();
}

export async function getAdById(adId) {
  return await Ad.findById(adId);
}

export async function updateAd(adId, updateData) {
  return await Ad.findByIdAndUpdate(adId, updateData, { new: true });
}

export async function deleteAd(adId) {
  return await Ad.findByIdAndRemove(adId);
}

export async function getAllAds() {
  return await Ad.find();
}