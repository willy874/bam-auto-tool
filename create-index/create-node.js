const path = require('path')
const prettier = require('prettier')
const fs = require('fs').promises
const {
  FileName
} = require('bam-utility-plugins')
module.exports = async function (folder, input = {}, output = {}) {
  const outputFileName = output.filename || 'index.js'
  const outputSuffix = input.suffix || output.suffix || ''
  const outputPrefix = input.prefix || output.prefix || ''
  const outputFileNameHandler = input.fileNameHandler || output.fileNameHandler || (f => {
    return new FileName(f).ConverBigHump()
  })
  return new Promise(resolve => {
    fs.readdir(folder).then(fileNames => {
      const indexOf = fileNames.indexOf(outputFileName)
      if (indexOf >= 0) fileNames.splice(indexOf, 1)
      const WriteNodejsIndex = () => {
        const strExport = fileNames
          .filter(f => /\.js$/.test(f))
          .map(f => `\n${outputPrefix + outputFileNameHandler(f) + outputSuffix}: require('./${f}')`)
          .join(',')
        return `module.exports = {${strExport}\n}\n`
      }
      const writeString = prettier.format(WriteNodejsIndex(), {
        semi: false,
        singleQuote: true,
        arrowParens: 'avoid',
        parser: 'babel',
      })
      fs.writeFile(path.resolve(folder, outputFileName), writeString).then(() => {
        console.log('Update '.green + folder.blue, outputFileName, 'success'.green, '.')
        resolve()
      })
    })
  })
}