const path = require('path')
const createWebpackIndex = require('./create-webpack')
const createNodeIndex = require('./create-node')
const {
  Observable
} = require('bam-utility-plugin')

const resolvePath = (url) => {
  return path.join(process.cwd(), ...url.split(/\/|\\/))
}


module.exports = async function (config) {
  console.log('Create index building...'.blue);
  if (typeof config.input === 'string') {
    await createWebpackIndex(resolvePath(config.input), config)
  } else if (typeof config.input === 'object') {
    if (Array.isArray(config.input)) {
      const observable = new Observable(subscriber => {
        config.input.forEach(input => {
          subscriber.next(async () => {
            if (typeof input === 'string') {
              await createWebpackIndex(resolvePath(input))
            } else {
              if (input.type === 'cjs') {
                await createNodeIndex(resolvePath(input.path), config)
              } else {
                await createWebpackIndex(resolvePath(input.path), config)
              }
            }
          })
        })
        subscriber.error(() => {
          console.log('Observable error'.red)
        })
        subscriber.complete(() => {
          console.log('build finish'.blue)
        })
      })
      observable.run()
    } else {
      if (config.input.type === 'cjs') {
        await createNodeIndex(resolvePath(config.input.path), config)
      } else {
        await createWebpackIndex(resolvePath(config.input.path), config)
      }
      console.log('build finish'.blue)
    }
  } else {
    console.log('[Bam Tool] Is not a index config.'.red)
  }
}