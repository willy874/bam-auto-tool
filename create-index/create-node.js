const path = require('path')
const prettier = require('prettier')
const fs = require('fs').promises
const { FileName } = require('../function')
module.exports = function (folder, suffix = '') {
  return new Promise(resolve => {
    fs.readdir(path.resolve.apply(path, folder)).then(fileNames => {
      const indexOf = fileNames.indexOf('index.js')
      if (indexOf >= 0) fileNames.splice(indexOf, 1)
      const WriteNodejsIndex = () => {
        const strExport = fileNames
          .filter(f => /\.js$/.test(f))
          .map(f => `\n${new FileName(f).ConverBigHump() + suffix}: require('./${f}')`)
          .join(',')
        return `module.exports = {${strExport}\n}\n`
      }
      const output = path.resolve.apply(path, folder)
      const writeString = prettier.format(WriteNodejsIndex(), {
        semi: false,
        singleQuote: true,
        arrowParens: 'avoid',
        parser: 'babel',
      })
      fs.writeFile(path.resolve(output, 'index.js'), writeString).then(() => {
        console.log('Update '.green + folder.join('\\').blue + ' index success.'.green)
        resolve()
      })
    })
  })
}
