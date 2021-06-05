require('dotenv').config()
require('colors')
const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')
const cleaner = require('rollup-plugin-cleaner')
const commonjs = require('rollup-plugin-commonjs')
const loaderJson = require('@rollup/plugin-json')
const path = require('path')
const root = path.join(__dirname, '..', '..')
// const root = process.env.ROOT

async function build(input = {}, output = {}) {
  // dirname & filename 合併
  if (output.filename) {
    if (output.dirname) {
      output.file = output.dirname + output.filename + '.js'
    } else {
      output.file = 'rollup-bundle/dist/' + output.filename + '.bundle.js'
    }
  }
  // 建構輸出設定
  const outputOption = Object.assign(
    {
      file: 'rollup-bundle/dist/bundle.js',
      format: 'esm', // cjs
      exports: 'named', // default
    },
    output
  )
  // 清除多餘的屬性
  delete outputOption.dirname
  delete outputOption.filename
  delete outputOption.cleaner
  // 建構輸入設定
  const inputOption = Object.assign(
    {
      plugins: [
        cleaner({
          targets: output.cleaner,
        }),
        resolve(),
        commonjs(),
        loaderJson(),
        postcss({
          minimize: true,
          modules: {
            generateScopedName: '[hash:base64:5]',
          },
          extract: output.dirname + output.filename + '.css',
        }),
      ],
    },
    input
  )

  const bundle = await rollup.rollup(inputOption)
  await bundle.generate(outputOption)
  const write = await bundle.write(outputOption)
  console.log('Rollup bundle '.green + 'output'.yellow + ' is '.green + outputOption.file.blue)
  return write
}

function buildFunction() {
  const bundleName = 'function'
  const input = `${root}/plugins/src/components/function/index.js`
  const external = ['dayjs', 'uuid', 'lodash']
  console.log('Rollup bundle '.green + 'input'.yellow + ' as '.green + bundleName.yellow + ' ' + input.blue)
  return Promise.all([
    build({ input, external }, { filename: 'function' }),
    build({ input, external }, { format: 'cjs', dirname: `${root}/app/function/`, filename: 'index' }),
    build({ input, external }, { format: 'cjs', dirname: `${root}/auto/function/`, filename: 'index' }),
    build({ input, external }, { dirname: `${root}/backend/src/library/function/`, filename: 'index' }),
  ])
}
function buildIcon() {
  const bundleName = 'icon'
  const input = `${root}/plugins/src/components/icon/index.js`
  const external = ['vue']
  console.log('Rollup bundle '.green + 'input'.yellow + ' as '.green + bundleName.yellow + ' ' + input.blue)
  return Promise.all([
    build({ input, external }, { filename: bundleName }),
    build({ input, external }, { dirname: `${root}/backend/src/plugins/icon/`, filename: 'index' }),
  ])
}
function buildDialog() {
  const bundleName = 'dialog'
  const input = `${root}/plugins/src/components/dialog/index.js`
  const external = ['vue', 'classnames', 'uuid']
  console.log('Rollup bundle '.green + 'input'.yellow + ' as '.green + bundleName.yellow + ' ' + input.blue)
  return Promise.all([
    build({ input, external }, { filename: bundleName }),
    build({ input, external }, { dirname: `${root}/backend/src/plugins/dialog/`, filename: 'index' }),
  ])
}

Promise.all([buildFunction(), buildIcon(), buildDialog()]).then(() => {
  console.log('Rollup build success'.green)
})
