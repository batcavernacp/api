import schemalizer from 'schemalizer'

const schema = schemalizer(__dirname, { basePath: '', directives: '_directives', mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts' })

export default schema
