import { AuthenticationError } from 'apollo-server-express';
import mongoose from 'mongoose';

export default {
  Query: {
    device: async (parent, { id }, { models: { deviceModel } }, info) => {
      const device = await deviceModel.find({ id: id }).exec();
      return device[0];
    },
    devices: async (parent, args, { models: { deviceModel } }, info) => {
      const devices = await deviceModel.find().exec();
      return devices;
    },
  },
  Mutation: {
    createDevice: async (parent, { id, name }, { models: { deviceModel }}, info) => {
      let oid = mongoose.Types.ObjectId;
      const post = await deviceModel.create({id, name, _id:new oid()});
      return post;
    },
  },
  Device: {
    id: (device) => device.id,
    name: (device) => device.name,
    readings: (device) => device.readings,
  },
};