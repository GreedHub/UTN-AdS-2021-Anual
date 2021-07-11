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

      const [user, userError] = await PromiseHandler(userModel.find({ username }).exec());
      if(userError) throw new AuthenticationError("Invalid user");

      const [isPasswordCorrect,passwordError] = await PromiseHandler(verifyPassword(password,user[0].password,user[0].salt));
      if(passwordError) throw new AuthenticationError("Cannot validate password");

      if(!isPasswordCorrect) throw new AuthenticationError('Invalid password');

      //TODO: create and return token
      return user[0];

    },
  },
  Mutation: {
    createUser: async (parent, { firstName, lastName, username, password, email, tenantId }, { models: { userModel }}, info) => {
      try{
        let oid = mongoose.Types.ObjectId;
        const secret = await hashPassword(password);
        console.log(secret)
        const { hash, salt } = secret;

        const user = await userModel.create({
          id:new oid(),
          firstName,
          lastName,
          username,
          password:hash,
          email,
          tenantId,
          salt,
          isEmailVerified:true, //TODO: add email verification
          sessions:[],
        });

        return user;
      }catch(error){
        throw new Error(error);
      }
    },
  },
  User: {
    id:        (user) => user.id,
    email:     (user) => user.email,
    firstName: (user) => user.firstName,
    lastName:  (user) => user.lastName,
    username:  (user) => user.username,
    tenantId:  (user) => user.tenantId,
    sessions:  (user) => user.sessions,
    salt:      ()     => "***",
    password:  ()     => "***",
    isEmailVerified:  (user) => user.isEmailVerified,
  },
};