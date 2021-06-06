require('dotenv').config()
require('colors')
const scriptModules = {
  svg: require('../svg'),
  // model: require('../model'),
  index: require('../create-index')
}

module.exports = function (config) {
  const npmConfigArgv = JSON.parse(process.env.npm_config_argv)
  const original = npmConfigArgv.original.slice()
  original.splice(0, 2)
  const moduleName = original[0]
  if (scriptModules[moduleName]) {
    scriptModules[moduleName](config[moduleName])
  } else {
    console.log('[Bam Tool] Is not a index script.'.red)
  }
}