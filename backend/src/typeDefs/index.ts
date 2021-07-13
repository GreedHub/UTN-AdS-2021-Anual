import deviceTypes from './device'
import readingTypes from './reading'
import userTypes from './user'
import authTypes from './auth'
import { gql } from 'apollo-server-express';

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, deviceTypes, readingTypes, userTypes, authTypes];