import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    readings: async (parent, {deviceId}, { models: { deviceModel } }, info) => {
      const device = await deviceModel.find({ id: deviceId }).exec();
      return device.readings;
    },
  },
  Mutation: {
    createReading: async (parent, { deviceId, reading }, { models: { deviceModel } }, info) => {
      const response = await deviceModel.findOneAndUpdate({id:deviceId},{ $push: {readings: reading }})     
      return response.readings.find(reading=>reading.timestamp === reading.timestamp);
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