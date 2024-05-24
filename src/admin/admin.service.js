import PropertyRequest from '../property-requests/property-request.schema.js';
import Ad from '../ads/ad.schema.js';
import User from '../users/user.schema.js'

export const getStats = async (page = 1, limit = 10) => {
  try {

    // Aggregation pipeline for property requests
    const propertyRequestPipeline = [
      // Group property requests by user and calculate statistics
      {
        $group: {
          _id: '$user',
          requestsCount: { $sum: 1 },
          totalRequestsAmount: { $sum: '$price' }
        }
      }
    ];

    // Aggregation pipeline for ads
    const adPipeline = [
      // Group ads by user and calculate statistics
      {
        $group: {
          _id: '$user',
          adsCount: { $sum: 1 },
          totalAdsAmount: { $sum: '$price' }
        }
      }
    ];

    // Execute aggregations
    const propertyRequestsStats = await PropertyRequest.aggregate(propertyRequestPipeline);
    const adsStats = await Ad.aggregate(adPipeline);

    // Map user IDs from results
    const userIds = [
      ...propertyRequestsStats.map(stat => stat._id),
      ...adsStats.map(stat => stat._id)
    ];

    // Fetch user details for the mapped IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Combine statistics for property requests and ads
    const stats = users.map(user => {
      const propertyRequestsStat = propertyRequestsStats.find(stat => stat._id.equals(user._id));
      const adsStat = adsStats.find(stat => stat._id.equals(user._id));

      return {
        name: user.name,
        role: user.role,
        phone: user.phone,
        requestsCount: propertyRequestsStat ? propertyRequestsStat.requestsCount : 0,
        totalRequestsAmount: propertyRequestsStat ? propertyRequestsStat.totalRequestsAmount : 0,
        adsCount: adsStat ? adsStat.adsCount : 0,
        totalAdsAmount: adsStat ? adsStat.totalAdsAmount : 0
      };
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = stats.length;
    const results = stats.slice(startIndex, endIndex);

    const hasNextPage = endIndex < total;
    const hasPreviousPage = startIndex > 0;

    return {
      data: results,
      page,
      limit,
      total,
      hasNextPage,
      hasPreviousPage
    };
  } catch (error) {
    throw new Error('Failed to get user statistics');
  }
};