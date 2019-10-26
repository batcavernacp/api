import { exportFolder } from '../packages/folder-utils'

export default exportFolder(__dirname, '-repository', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts' })
