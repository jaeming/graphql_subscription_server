import { pubsub } from '../index'

export default {
  Subscription: {
    message: {
      subscribe: () => pubsub.asyncIterator(['GENERAL_MESSAGES'])
    }
  },
  Query: {
    helloWorld: () => 'Hello World!'
  },
  Mutation: {
    publishMessage: (_, { message }) => pubsub.publish('GENERAL_MESSAGES', { message })
  }
}
