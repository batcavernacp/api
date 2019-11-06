import schemalizer from 'schemalizer'

export interface Input<T> {
  input: T;
}

export interface PageInput {
  after: string;
  before: string;
  first: number;
  last: number;
}

export const schema = schemalizer(__dirname, {
  basePath: '',
  directives: '_directives',
  mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts'
})
