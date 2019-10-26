import redis from 'async-redis'

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

client.on('connect', () => {
  if (process.env.REDIS_PASSWORD) client.auth(process.env.REDIS_PASSWORD)
  console.log('redis connected')
})

client.on('error', err => console.log(err))

export default client
