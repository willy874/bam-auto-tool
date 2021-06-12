require('colors')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const {
  resolvePath
} = require('../utility')

module.exports = function (config) {
  if (config.input) {
    webpackConfig.entry = resolvePath(config.input)
  }
  if (config.output) {
    webpackConfig.output.path = resolvePath(config.output)
  }
  if (config.filename) {
    webpackConfig.output.filename = config.filename
  }
  webpack(webpackConfig, () => {
    console.log('Create ckeditor bundle package success.'.green)
  })
}