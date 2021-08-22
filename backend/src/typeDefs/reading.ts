import { gql } from 'apollo-server-express';

export default gql`
  type Reading {
    id:ID!
    timestamp: String!
    name: String!
    type: String!
    value: String!
    magnitude: String
  }

  input ReadingInput{
    timestamp: String!
    name: String!
    type: String!
    value: String!
    magnitude: String
  }

  input ReadingFilter{
    from: Float!
    to: Float!
  }

  extend type Query {
    reading(id: ID!): Reading!
    readings(deviceId:String!,sensorName:String,filter:ReadingFilter): [Reading!]!
  }

  extend type Mutation {
    createReading(deviceId:String!, reading: ReadingInput!): Reading!
  }
`;