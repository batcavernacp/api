import schemalizer from 'schemalizer'

export interface Input<T> {
  input: T;
}

export const schema = schemalizer(__dirname, {
  basePath: '',
  directives: '_directives',
  mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts'
})
