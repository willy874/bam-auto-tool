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
      const WriteWebpackIndex = () => {
        const strImport = fileNames
          .map(f => `import ${new FileName(f).ConverBigHump() + (output.suffix || '')} from './${f}'\n`)
          .join('')
        const strExport = fileNames.map(f => `\n${new FileName(f).ConverBigHump() + (output.suffix || '')}`).join(',')
        return `${strImport}\nexport {${strExport}\n}\n`
      }
      const writeString = prettier.format(WriteWebpackIndex(), {
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