import { gql } from 'apollo-server-express';

export default gql`
  type Device {
    id: ID!
    name: String!
    readings: [Reading!]!
  }

  extend type Query {
    device(id: ID!): Device!
    devices: [Device!]!
  }

  extend type Mutation {
    createDevice(id: ID!, name: String!): Device!
  }
`;