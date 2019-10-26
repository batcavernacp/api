import { RedisPubSub } from 'graphql-redis-subscriptions'

export default new RedisPubSub({
  connection: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: options => Math.max(options.attempt * 100, 3000)
  }
})
