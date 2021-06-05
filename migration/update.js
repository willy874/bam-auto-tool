require('colors')
require('dotenv').config()
const path = require('path')
const fs = require('fs').promises
const dayjs = require('dayjs')
const prettier = require('prettier')
const { FileName } = require('../function')

const scripts = process.env.npm_lifecycle_script.split(' ')
if (scripts.length > 2) {
  const scriptOrder = scripts[2].split('"')[1]
  const updateWriteString = () => {
    return `
const Migration = require('../migration')
const Schema = require('../schema')
const Blueprint = require('../blueprint')

module.exports = class ${filename.ConverBigHump()}Table extends Migration {
  constructor(args) {
    const entity = args ? args : {}
    super({
      connection: entity.connection,
    })
    this.tableName = '${filename.data.join('_')}'
  }
  up() {
    return Schema.update(this, (table = new Blueprint()) => {})
  }
  down() {
    return Schema.drop(this, (table = new Blueprint()) => {})
  }
}
`
  }
  const filename = new FileName(scriptOrder)
  const writeString = prettier.format(updateWriteString(), {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    parser: 'babel',
  })
  fs.writeFile(
    path.join(__dirname, 'history', `${dayjs().format('YYYY_MM_DD_HHmmss')}_update_${scriptOrder}.js`),
    writeString
  ).then(() => {
    console.log(
      'Update'.green,
      `${filename.ConverBigHump()}Table`.yellow,
      'by',
      dayjs().format('YYYY/MM/DD HH:mm:ss').yellow,
      'success.'.green
    )
  })
} else {
  console.log('Please fill in the name of the table to be updated.'.red)
}
