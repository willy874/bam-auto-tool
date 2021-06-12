const path = require('path')
const build = require('./core')
const createIndex = require('../create-index')

const {
  inputPathCallback,
  outputPathCallback,
  folderPathCallback,
  resolvePath
} = require('../utility')

/**
 * @function Plugin
 * @property {Function} nextHandler 處理過程中的過處理件
 * @property {Function} endHandler 處理成字串後的過處理件
 */

module.exports = async function (config) {
  console.log('Models building...'.blue);
  await inputPathCallback(config, async (inputFolder, inputData) => {
    await folderPathCallback(inputFolder, async (filePath) => {
      await outputPathCallback(config, inputData, async (folder, input, output) => {
        if (path.basename(filePath) === 'index.js') {
          return
        } else {
          const ops = await build({
            filePath,
            baseInputPath: inputFolder,
            baseOutputPath: folder,
            input,
            output,
            config,
            schema: require(resolvePath(inputFolder))
          })
          if (ops) {
            if (ops.status === 'Create' || ops.status === 'Overwrite') {
              console.log(ops.status.green, ops.writePath.yellow, `View Model success.`.green)
            }
          }
          return
        }
      })
    })
  })
  await createIndex({
    input: config.output
  })
  console.log('Models buildedEnd...'.blue);
}