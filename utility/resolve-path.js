const path = require('path')

module.exports = (url) => {
  if (path.parse(url).root) {
    return url
  }
  return path.join(process.cwd(), ...url.split(/\/|\\/).filter(p => p))
}