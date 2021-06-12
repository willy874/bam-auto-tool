const path = require('path')
const {
  FileName,
} = require('bam-utility-plugins')

module.exports = async function (ops) {
  const modelName = new FileName(path.basename(ops.filePath)).ConverBigHump()
  const model = ops.schema[modelName]
  const isModel = (type) => typeof type === 'string' && /Model$/.test(type)
  const importModels = []
  const pushDepend = (m) => {
    const module = m.replace(/Model/, '')
    if (!importModels.includes(module)) {
      importModels.push(module)
    }
  }
  // 繼承模組
  const extendsModel = 'Extends' + model.extends
  if (model.extends) {
    pushDepend(model.extends)
  }
  // 依賴模組
  model.tebles.filter(table => {
    return isModel(table.type) || isModel(table.itemType)
  }).forEach(table => {
    if (table.type) pushDepend(table.type)
    if (table.itemType) pushDepend(table.itemType)
  })
  // api 規則建立模組
  const apiPath = () => {
    if (model.api) {
      return model.api
    }
    const base = ops.baseInputPath.split(/\/|\\/).join('/')
    return ops.filePath.replace(/\.ts|\.js|\.json/, '').split(/\/|\\/).join('/').replace(base + '/', '')
  }
  // 預設值
  const defaultValueText = (table) => {
    const value = table.default
    if (value instanceof Array) return value.length ? `[${value.join(',')}]` : '[]'
    if (typeof value === 'function') return value.name
    if (typeof value === 'string') return value ? `'${value}'` : "''"
    if (typeof value === 'object') return value === null ? 'null' : '{}'
    return value
  }
  // 資料表值
  const tableValueTable = (table) => {
    const tableType = table.type.name || table.type
    if (table.type === Array) {
      return `entity.${table.name} ? entity.${table.name}.map(p=>new ${table.itemType}(p)) : ${defaultValueText(table)}
              this.arrayModel.${table.name} = ${table.itemType}`
    }
    if (isModel(tableType)) {
      return `new ${tableType}(entity.${table.name})`
    }
    return `entity.${table.name} || ${defaultValueText(table)}`
  }

  const modelClassString = (`
  class ${modelName}Model${extendsModel} {
    constructor(args){
      ExtendsSuper(args)
      const entity = args || {}
      ${model.tebles.map((table) => `this.${table.name} = ${tableValueTable(table)}`).join('\n      ')}
      // proto set
      this.api = entity.api || '${apiPath()}'
    }
  }
  `)

  const modelClass = eval(`;(${modelClassString})`)
  modelClass.extendsModel = extendsModel
  modelClass.importModels = importModels
  return modelClass
}