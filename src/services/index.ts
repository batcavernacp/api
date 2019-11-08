import { exportFolder } from '../packages/folder-utils'
import { MqttClient } from 'mqtt'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { FirebaseService } from './firebase-service'

const services: Services = exportFolder(__dirname, '-service', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts' })

export interface Services {
  mqtt: MqttClient;
  pubsub: RedisPubSub;
  firebase: FirebaseService;
  redis: any;
}

export { services }
