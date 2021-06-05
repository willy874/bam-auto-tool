// prettier-disable
const path = require('path')
const fs = require('fs').promises
const prettier = require('prettier')
const config = require('./config')
const { FileName }  = require('../function')

// FIXME
/**
 * 針對保留字和 SQL Injection 要做額外處理
 */
/**
 * 對資料庫進行 `CREATE TABLE IF NOT EXISTS <Table Name>`
 */
exports.queryCreate = function () {
  return new Promise((resolve, reject) => {
    const conn = this.BlueprintConnection
    const tables = this.BlueprintTables
    const tableName = this.BlueprintTableName
    const fileName = this.BlueprintFile
    const primaryKey = this.BlueprintTables.find(t => t.primaryKey)
    const lengthData = t => (t.length === undefined ? '' : ' (' + t.length + ')')
    const nullable = t => (t.nullable ? ' NULL' : ' NOT NULL')
    const autoIncrement = t => (t.auto ? ' AUTO_INCREMENT' : '')
    const defaultData = t => (t.default === undefined ? '' : ` DEFAULT ${t.default}`)
    const foreignKey = t => {
      if (t.foreignKey && t.foreignKey.length) {
        return `${t.foreignKey.map(f => `  FOREIGN KEY (${f.name}) REFERENCES ${f.table}(${f.key}) \n`)},`
      }
      return ''
    }
    const sqlQuery = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  ${tables.map(table =>`${table.name} ${table.type}${lengthData(table)}${nullable(table)}${autoIncrement(table)}${defaultData(table)}`).join(',\n  ')},
  ${tables.map(table =>foreignKey(table)).join('')}
  PRIMARY KEY (${primaryKey.name})
);`
    conn
      .query(sqlQuery)
      .on('result', result => {
        console.log('Migration create'.green, path.join(__dirname, 'history', `${fileName}`).yellow, 'success.'.green)
        resolve(result)
      })
      .on('error',reject)
  })
}
/**
 * 
 */
exports.queryUpdate = function () {
  return new Promise((resolve, reject) => {
    const conn = this.BlueprintConnection
    const tables = this.BlueprintTables
    const tableName = this.BlueprintTableName
    const fileName = this.BlueprintFile
    const sqlQuery = ``
    console.log('sqlQuery:', sqlQuery)
    conn
      .query(sqlQuery)
      .on('result', result => {
        console.log('Migration update'.green, path.join(__dirname, 'history', `${fileName}`).yellow, 'success.'.green)
        resolve(result)
      })
      .on('error',reject)
  })
}
/**
 * 對資料庫進行 `DROP TABLE <Table Name>`
 */
exports.queryDrop = function () {
  return new Promise((resolve, reject) => {
    const conn = this.BlueprintConnection
    const tableName = this.BlueprintTableName
    if (this.BlueprintDrop) {
      const sqlQueris =
        this.BlueprintDrop.length === 0
          ? [`DROP TABLE IF EXISTS ${tableName};`]
          : this.BlueprintDrop.map(t => `ALTER TABLE ${tableName} DROP ${t};`)
      sqlQueris.forEach(sqlQuery => {
        conn
          .query(sqlQuery)
          .on('result', result => {
            console.log(`Drop table ${tableName}.`.red)
            resolve(result)
          })
          .on('error',reject)
      })
    }
  })
}


exports.modelWrite = async function () {
  const tableName = this.BlueprintTableName
  const tables = this.BlueprintTables
  const filename =  new FileName(tableName)
  const writeFile = filename.data.join('-') + '.js'
  const writePath = path.join(path.join(...config.output), writeFile)
  const writeString = '' +
`const Model = require('./core')
module.exports = class ${filename.ConverBigHump()}Model extends Model {
  constructor() {
    super()
    this.table = '${filename.data.join('_')}'
    this.fillable = [${tables.map(t => `'${t.name}'`).join(',')}]
  }
}`
  const prettierString = prettier.format(writeString, {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    parser: 'babel',
  })
  const folders = await fs.readdir(path.join(...config.output))
  if (folders.includes(writeFile) && !config.overwrite) {
    return Promise.resolve()
  }
  return await fs.writeFile(writePath, prettierString)
    .then(() => {
      console.log(
        folders.includes(writeFile) ? 'Overwrite'.green : 'Create'.green,
        `${filename.data.join('-')}.js`.yellow,
        'View Model success.'.green, 
        writePath.blue
      )
    })
}