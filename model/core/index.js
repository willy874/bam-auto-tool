const buildViewModel = require('./view-model')
const methods = require('../../function')

module.exports = function (settings) {
  settings.methods = methods
  buildViewModel(settings)
}
