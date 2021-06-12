const path = require('path')

module.exports = (url) => {
  return path.join(process.cwd(), ...url.split(/\/|\\/).filter(p => p))
}