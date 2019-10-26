import { exportFolder } from '../packages/folder-utils'

export default exportFolder(__dirname, '-service', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts' })
