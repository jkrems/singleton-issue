'use strict';

const { GraphQLSchema, GraphQLObjectType, GraphQLInt } = require('graphql');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      id: {
        type: GraphQLInt,
        resolve() {
          return 42;
        },
      }
    },
  }),
});
