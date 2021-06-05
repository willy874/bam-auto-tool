const path = require('path')
const root = path.join(__dirname, '..', '..')
module.exports = {
  root,
  output: [root, 'app', 'models'],
  overwrite: true,
}
