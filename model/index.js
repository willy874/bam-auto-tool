require('dotenv').config()
require('colors')
const build = require('./core')
const config = require('./config')

console.log('models building...'.blue)
build(config)
