import { gql } from 'apollo-server-express';

export default gql`
  type Device {
    _id: ID!
    id: String!
    name: String!
    readings: [Reading]
  }

  extend type Query {
    device(id: ID!): Device!
    devices: [Device!]!
  }

  extend type Mutation {
    createDevice(id: String!, name: String!): Device!
  }

`;