import * as path from 'path'
import createGraphQLLogger from 'graphql-log'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { typeDefs as scalarsTypeDefs, resolvers as scalarsResolvers } from 'graphql-scalars'

const typesArray = [
  ...fileLoader(path.join(__dirname, './**/*.graphql')),
  ...scalarsTypeDefs,
]

const resolverArray = [
  ...fileLoader(path.join(__dirname, './**/*.resolvers.*')),
  scalarsResolvers,
]

export const typeDefs = mergeTypes(typesArray)
export const resolvers = mergeResolvers(resolverArray)
export const moduleMiddlewares = fileLoader(path.join(__dirname, './**/*.middleware.js'))

const logExecution = createGraphQLLogger()
logExecution(resolvers)

const schemaWithoutMiddleware = makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

export default schemaWithoutMiddleware
