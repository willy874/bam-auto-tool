const {
  Observable
} = require('bam-utility-plugins')

module.exports = function (config, input, callback) {
  return new Promise(async (resolve, reject) => {
    if (typeof config.output === 'string') {
      await callback(config.output, input, undefined)
      resolve()
    } else if (typeof config.output === 'object') {
      if (Array.isArray(config.output)) {
        const observable = new Observable(subscriber => {
          config.output.forEach(output => {
            subscriber.next(async () => {
              if (typeof output === 'string') {
                await callback(output, input, undefined)
              } else {
                await callback(output.path, input, output)
              }
            })
          })
          subscriber.error(reject)
          subscriber.complete(resolve)
        })
        observable.run()
      } else {
        await callback(config.output.path, input, config.output)
        resolve()
      }
    } else {
      console.log('[Bam Tool] Is not a config.'.red)
      resolve()
    }
  })
}