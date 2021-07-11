import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id:ID!
    firstName: String!
    lastName: String!
    username: String!
    password: String!
    email: String!
    isEmailVerified: Boolean!
    tenantId: String!
    salt: String!
    sessions: [Session!]!
  }

  type Session{
    id: ID!
    deviceName: String!
    deviceIp: String!
    creationDate: Int!
    lastTimeActive: Int!
    token: String!
  }

  type LoginOutput{
    token: String!
  }

  extend type Query {
    user(id: ID!): User!
    users: [User!]!
    login(username: String!, password: String!): LoginOutput!
  }

  extend type Mutation {
    createUser(firstName:String!,lastName:String!,username:String!,password:String!,email:String!,tenantId:String!): User!
  }
`;