const path = require('path')
const prettier = require('prettier')
const fs = require('fs').promises
const {
  FileName
} = require('bam-utility-plugin')
module.exports = async function (folder, config = {}) {
  const output = config.output || {}
  return new Promise(resolve => {
    fs.readdir(folder).then(fileNames => {
      const indexOf = fileNames.indexOf('index.js')
      if (indexOf >= 0) fileNames.splice(indexOf, 1)
      const WriteNodejsIndex = () => {
        const strExport = fileNames
          .filter(f => /\.js$/.test(f))
          .map(f => `\n${new FileName(f).ConverBigHump() + (output.suffix || '')}: require('./${f}')`)
          .join(',')
        return `module.exports = {${strExport}\n}\n`
      }
      const writeString = prettier.format(WriteNodejsIndex(), {
        semi: false,
        singleQuote: true,
        arrowParens: 'avoid',
        parser: 'babel',
      })
      fs.writeFile(path.resolve(folder, 'index.js'), writeString).then(() => {
        console.log('Update '.green + folder.blue + ' index success.'.green)
        resolve()
      })
    })
  })
}