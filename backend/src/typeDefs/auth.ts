import { gql } from 'apollo-server-express';

export default gql`

  type LoginOutput{
    token: String!
    refreshToken: String!
  }

  extend type Mutation {
    login(username: String!, password: String!): LoginOutput!
  }
`;