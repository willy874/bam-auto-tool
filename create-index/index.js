const createWebpackIndex = require('./create-webpack')
const createNodeIndex = require('./create-node')
const {
  inputPathCallback,
  resolvePath
} = require('../utility')

module.exports = async function (config) {
  console.log('Create index building...'.blue)
  await inputPathCallback(config, async (folder, input = {}, output = {}) => {
    if (input && input.type === 'cjs') {
      await createNodeIndex(resolvePath(folder), input, output)
    } else {
      if (output && output.type === 'cjs') {
        await createNodeIndex(resolvePath(folder), input, output)
      } else {
        await createWebpackIndex(resolvePath(folder), input, output)
      }
    }
  })
}