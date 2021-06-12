require('colors')
const testFunction = require('../utility/folder-path-callback')

console.log('test...'.blue)
testFunction('model', path => {
  console.log(path)
})