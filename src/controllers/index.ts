import { exportFolder } from '../packages/folder-utils'

const inject = services => exportFolder(__dirname, '-controller', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts', inject: services })

export default inject
