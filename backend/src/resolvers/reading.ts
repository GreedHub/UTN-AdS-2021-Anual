import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    reading: async (parent, { id }, { models: { postModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const post = await postModel.findById({ _id: id }).exec();
      return post;
    },
    readings: async (parent, args, { models: { postModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const posts = await postModel.find({ author: me.id }).exec();
      return posts;
    },
  },
  Mutation: {
    createDevice: async (parent, { title, content }, { models: { postModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const post = await postModel.create({ title, content, author: me.id });
      return post;
    },
  },
  Reading: {
    author: async ({ author }, args, { models: { userModel } }, info) => {
      const user = await userModel.findById({ _id: author }).exec();
      return user;
    },
  },
};