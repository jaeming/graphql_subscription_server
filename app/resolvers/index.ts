import { pubsub } from '../index'

export default {
  Subscription: {
    message: {
      subscribe: () => pubsub.asyncIterator(['DOWNLOAD_READY'])
    }
  },
  Query: {
    helloWorld: () => 'Hello World!'
  },
  Mutation: {
    publishMessage: (_, { message }) => pubsub.publish('DOWNLOAD_READY', { message })
  }
}
