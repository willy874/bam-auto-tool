const {
  Observable
} = require('bam-utility-plugins')

module.exports = function (config, callback) {
  return new Promise(async (resolve, reject) => {
    if (typeof config.input === 'string') {
      await callback(config.input, undefined, config.output)
      resolve()
    } else if (typeof config.input === 'object') {
      if (Array.isArray(config.input)) {
        const observable = new Observable(subscriber => {
          config.input.forEach(input => {
            subscriber.next(async () => {
              if (typeof input === 'string') {
                await callback(input, undefined, config.output)
              } else {
                await callback(input.path, input, config.output)
              }
            })
          })
          subscriber.error(reject)
          subscriber.complete(resolve)
        })
        observable.run()
      } else {
        await callback(config.input.path, config.input, config.output)
        resolve()
      }
    } else {
      console.log('[Bam Tool] Is not a config.'.red)
      resolve()
    }
  })
}