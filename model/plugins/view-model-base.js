const _uniq = require('lodash/uniq')
const _concat = require('lodash/concat')

module.exports = function (ops, modelName) {
  const model = ops.schema[modelName]
  const { FileName } = ops.methods
  const isModel = type => typeof type === 'string' && /Model$/.test(type)
  // 繼承模組
  const importExtendsModel =
    model.extends === 'DataModel'
      ? `import DataModel from '../proto/data'\n`
      : `import { ${model.extends} } from './index'\n`
  // 依賴模組
  const importModule = (() => {
    const arr = []

    if (model.extends !== 'DataModel') arr.push(model.extends)
    return _uniq(
      _concat(
        arr,
        model.tebles.filter(table => isModel(table.type)).map(t => t.type),
        model.tebles.filter(table => isModel(table.itemType)).map(t => t.itemType)
      )
    )
  })()
  // 註解文字建立
  const commentText =
    '' +
    '/**\n' +
    ` * @extends ${model.extends}\n` +
    (model.description ? ` * ${model.description}\n` : '') +
    model.tebles
      .map(table => {
        const tableType = table.type.name || table.type
        const itemType = table.itemType ? `.<${table.itemType}>` : ''
        return ` * @property {${tableType}${itemType}} ${table.name} ${table.description}\n`
      })
      .join('') +
    ' */\n'
  // 預設值
  const defaultValueText = table => {
    const value = table.default
    if (value instanceof Array) return value.length ? `[${value.join(',')}]` : '[]'
    if (typeof value === 'function') return value.name
    if (typeof value === 'string') return value ? `'${value}'` : "''"
    if (typeof value === 'object') return value === null ? 'null' : '{}'
    return value
  }
  // 資料表值
  const tableValueTable = table => {
    const tableType = table.type.name || table.type
    if (table.type instanceof Array) {
      return `entity.${table.name} ? entity.${table.name}.map(p=>new ${teble.itemType}(p)) : ${defaultValueText(table)}`
    }
    if (isModel(tableType)) {
      return `new ${tableType}(entity.${table.name})`
    }
    return `entity.${table.name} || ${defaultValueText(table)}`
  }
  return (
    '' +
    importExtendsModel +
    (importModule.length ? `import {${importModule.join(',')}} from './index'\n` : '') +
    '\n' +
    commentText +
    `export default class ${modelName}Model extends ${model.extends}{\n` +
    `constructor(args){\n` +
    `super(args)\n` +
    `const entity = args || {}\n` +
    model.tebles.map(table => `this.${table.name} = ${tableValueTable(table)}\n`).join('') +
    '// proto set\n' +
    `this.api = '${new FileName(modelName).data.join('-')}'\n` +
    `}\n` +
    '}\n'
  )
}
