import { ApolloError } from 'apollo-server-express'
import geoip from 'geoip-lite'

import logger from '../../logger'

export default {
  Query: {
    getLocation: async (parent, args, ctx) => { // Query to get the location through IP
      try {
        const { where: { ipAddress } } = args
        return geoip.lookup(ipAddress)
      } catch (error) {
        logger.error(error)
        return new ApolloError(error)
      }
    },
  },
}
