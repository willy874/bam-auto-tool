require('dotenv').config()
require('colors')
const path = require('path')
const root = path.join(__dirname, '..', '..')
// const root = process.env.ROOT
const createWebpackIndex = require('./create-webpack')
const createNodeIndex = require('./create-node')

console.log('Create index building...'.blue)
;(async function () {
  await createWebpackIndex([root, 'backend', 'src', 'models', 'data'], 'Model')
  await createWebpackIndex([root, 'backend', 'src', 'models', 'proto'], 'Model')
  await createWebpackIndex([root, 'plugins', 'src', 'components', 'icon', 'pattern'])
  await createNodeIndex([root, 'plugins', 'src', 'components', 'function'])
  await createNodeIndex([root, 'app', 'models'], 'Model')
  await createNodeIndex([root, 'app', 'controller'], 'Controller')
  await createNodeIndex([root, 'app', 'service'], 'Service')
  console.log('build finish'.blue)
})()
