import { AuthenticationError } from 'apollo-server-express';
import { PromiseHandler, hashPassword, verifyPassword } from '../helpers';
import * as mongoose from 'mongoose';

export default {
  Query: {
    user: async (parent, { id }, { models: { userModel } }, info) => {
        const [user,error] = await PromiseHandler(userModel.find({ id }).exec());
        if(error) throw new Error(error);
        return user[0];   
    },
    users: async (parent, args, { models: { userModel } }, info) => {
      const [users,error] = await PromiseHandler(userModel.find().exec());
      if(error) throw new Error(error);
      return users;
    },
    login: async (parent, { username, password}, { models: { userModel } }, info) => {
      try{
        const user = await userModel.find({ username }).exec();
        const { salt } = user;
        const isPasswordCorrect = await verifyPassword(password,user.password,salt);

        if(!isPasswordCorrect) throw new AuthenticationError('Invalid password');

        //TODO: create and return token
      return user;
      }catch(error){
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createUser: async (parent, { id, name }, { models: { deviceModel }}, info) => {
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