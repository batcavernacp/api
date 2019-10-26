import { requireFolder } from '../../packages/folder-utils'

const inject = mongoose => requireFolder(__dirname, '-model', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts', inject: mongoose })

export default inject
