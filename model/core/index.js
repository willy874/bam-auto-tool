const path = require('path')
const {
  Observable,
} = require('bam-utility-plugins')
const compilerViewModelPlugin = require('../plugins/view-model-base')
const bundleHandler = require('./bundle-handle')

module.exports = function (settings) {
  return new Promise((resolve, reject) => {
    const {
      plugins
    } = settings.config
    const observable = new Observable(subscriber => {
      subscriber.next(modelClass => compilerViewModelPlugin(settings, modelClass))
      if (plugins && plugins instanceof Array) {
        plugins.forEach(plugin => {
          if (plugin.nextHandler) {
            subscriber.next(modelClass => plugin.nextHandler(settings, modelClass))
          }
        })
      }
      subscriber.error(reject)
      subscriber.complete(async modelClass => {
        resolve(await bundleHandler(settings, modelClass))
      })
    })
    observable.run()
  })
}