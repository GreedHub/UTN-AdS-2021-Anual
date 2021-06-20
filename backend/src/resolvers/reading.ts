import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    readings: async (parent, {deviceId}, { models: { deviceModel } }, info) => {
      const device = await deviceModel.find({ id: deviceId }).exec();
      return device.readings;
    },
  },
  Mutation: {
    createReading: async (parent, { deviceId, timestamp, values }, { models: { deviceModel } }, info) => {
      const response = await deviceModel.findOneAndUpdate({id:deviceId},{ $push: {readings: {timestamp,values} }})     
      return response.readings.find(reading=>reading.timestamp === timestamp);
    },
  },
  Reading: {
    id:         reading=> reading._id,
    timestamp:  reading => reading.timestamp,
    values:     reading => reading.values,
  },
};