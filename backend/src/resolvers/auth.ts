import { AuthenticationError } from 'apollo-server-express';
import { PromiseHandler, verifyPassword, generateRefreshToken, generateAccessToken } from '../helpers';

export default {
  Query: {

  },
  Mutation: {
    login: async (parent, { username, password}, { models: { userModel } }, info) => {

      //TODO: replace auth errors?
      let [user, userError] = await PromiseHandler(userModel.find({ username }).exec());
      user = user[0];
      if(userError) throw new AuthenticationError("Invalid user");

      const [isPasswordCorrect,passwordError] = await PromiseHandler(verifyPassword(password,user.password,user.salt));
      if(passwordError) throw new AuthenticationError("Cannot validate password");

      if(!isPasswordCorrect) throw new AuthenticationError('Invalid password');
      
      const getTokens = [
        generateAccessToken(username,user.id),
        generateRefreshToken(username,user.id),
      ]

      const tokens = await Promise.all(getTokens);

      return {
        token: tokens[0],
        refreshToken: tokens[1],
      };
    },
  },
  LoginOutput: {
    token:        (creds) => creds.token,
    refreshToken: (creds) => creds.refreshToken
  }
};