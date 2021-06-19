const fs = require('fs').promises
const fsNative = require('fs')
const path = require('path')
const prettier = require('prettier')
const {
  FileName
} = require('bam-utility-plugins')

const {
  resolvePath,
  checkOverWrite
} = require('../../utility')

const handler = (ops, modelClass) => {
  const modelName = new FileName(path.basename(ops.filePath)).ConverBigHump()
  const model = ops.schema[modelName]
  // 註解文字建立
  const commentText =
    '' +
    '/**\n' +
    ` * @extends ${model.extends}\n` +
    (model.description ? ` * ${model.description}\n` : '') +
    model.tebles
    .map((table) => {
      const tableType = table.type.name || table.type
      const itemType = table.itemType ? `.<${table.itemType}>` : ''
      return ` * @property {${tableType}${itemType}} ${table.name} ${table.description}\n`
    })
    .join('') +
    ' */'
  ops.writeString = '' +
    `import { ${modelClass.importModels.map(m => m + 'Model').join(',')} } from '../index'\n\n${commentText}
  export default ${
    ops.writeString.toString()
    .replace(modelClass.extendsModel, ` extends ${model.extends}`)
    .replace('ExtendsSuper', 'super')
  }
  `
}

module.exports = async function (ops, modelClass) {
  ops.writeString = modelClass.toString()
  handler(ops, modelClass)
  if (ops.plugins && ops.plugins instanceof Array) {
    ops.plugins.forEach(plugin => {
      if (plugin.endHandler) {
        plugin.endHandler(ops, modelClass)
      }
    })
  }
  ops.writeString = prettier.format(ops.writeString, {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    parser: 'babel',
  })

  const writePath = (() => {
    const base = ops.baseInputPath.split(/\/|\\/).join('/')
    return resolvePath(
      ops.baseOutputPath + ops.filePath.split(/\/|\\/).join('/').replace(base, '')
    )
  })()
  const fsWriteFile = async () => {
    ops.writePath = writePath
    await fs.writeFile(writePath, ops.writeString)
  }

  if (fsNative.existsSync(writePath)) {
    ops.status = 'None'
    if (ops.config.overwrite && checkOverWrite(ops.config.overwrite, writePath)) {
      await fsWriteFile()
      ops.status = 'Overwrite'
    } else {
      if (ops.input && ops.input.overwrite && checkOverWrite(ops.input.overwrite, writePath)) {
        await fsWriteFile()
        ops.status = 'Overwrite'
        if (ops.output && ops.output.overwrite && checkOverWrite(ops.output.overwrite, writePath)) {
          await fsWriteFile()
          ops.status = 'Overwrite'
        }
      } else {
        if (ops.output && ops.output.overwrite && checkOverWrite(ops.output.overwrite, writePath)) {
          await fsWriteFile()
          ops.status = 'Overwrite'
        }
      }
    }
  } else {
    ops.status = 'Create'
    await fsWriteFile()
  }
  return ops
}