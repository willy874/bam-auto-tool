const path = require('path')
const root = path.join(__dirname, '..', '..')
const schema = require('./schema')
// const root = process.env.ROOT

module.exports = {
  root,
  schema,
  output: {
    viewModel: path.join(...['backend', 'src', 'models', 'data']),
  },
  // data,
  overwrite: true,
  plugins: [],
}
