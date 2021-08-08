import { gql } from 'apollo-server-express';

export default gql`
  type Reading {
    id:ID!
    timestamp: Int!
    name: String!
    type: String!
    value: String!
    magnitude: String
  }

  input ReadingInput{
    timestamp: Int!
    name: String!
    type: String!
    value: String!
    magnitude: String
  }

  extend type Query {
    reading(id: ID!): Reading!
    readings: [Reading!]!
  }

  extend type Mutation {
    createReading(deviceId:String!, reading: ReadingInput!): Reading!
  }
`;