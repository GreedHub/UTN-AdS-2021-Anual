import { gql } from 'apollo-server-express';

export default gql`
  type Reading {
    id: ID!
    timestamp: Int!
    value: String!
  }

  extend type Query {
    reading(id: ID!): Reading!
    readings: [Reading!]!
  }

  extend type Mutation {
    createReading(timestamp: Int!, value: String!): Reading!
  }
`;