import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    readings: async (parent, {deviceId,sensorName}, { models: { deviceModel } }, info) => {
      const readings = await deviceModel.aggregate([
        { $match: { "id": deviceId } },
        { $unwind: "$readings"},
        { $match: {"readings.name":sensorName} },
        { $project: { "readings":1 } },
        { $skip:  1 },
        { $limit: 2 },
      ]).exec();
      return readings.map(reading=>reading.readings);
    },
  },
  Mutation: {
    createReading: async (parent, { deviceId, reading }, { models: { deviceModel } }, info) => {
      
      const response = await deviceModel.findOneAndUpdate({id:deviceId},{ $push: {readings: reading }})     
      return response.readings.find(_reading=>_reading.timestamp === reading.timestamp);
    },
  },
  Reading: {
    id:        reading => reading._id,
    timestamp: reading => reading.timestamp,
    name:      reading => reading.name,
    type:      reading => reading.type,
    value:     reading => reading.value,
    magnitude: reading => reading.magnitude,
  },
};