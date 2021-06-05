require('dotenv').config()
require('colors')
const fs = require('fs').promises
const path = require('path')
const prettier = require('prettier')
const parse5 = require('parse5')
const config = require('./config')
const createIndex = require('../create-index/create-webpack')

const strFilter = str => {
  return str.replace(/\r\n|\n|\t/g, '')
}
fs.readdir(path.resolve.apply(path, config.inputFolder)).then(filenames => {
  Promise.all(
    filenames.map(filename => {
      if (!/\.svg$/.test(filename)) {
        return Promise.resolve()
      }
      return new Promise(resolve => {
        fs.readFile(path.resolve(path.resolve.apply(path, config.inputFolder), filename)).then(data => {
          const document = parse5.parse(data.toString())
          const domForEach = callback => {
            const loop = dom => {
              const domData = {}
              domData.tag = dom.tagName || dom.nodeName
              if (dom.attrs && dom.attrs.length) {
                domData.attrs = {}
                dom.attrs.forEach(attr => {
                  domData.attrs[attr.name] = attr.value
                })
              }
              if (dom.value) {
                domData.text = dom.value
              }
              if (dom.childNodes && dom.childNodes.length) {
                domData.children = dom.childNodes.map(child => {
                  return loop(child)
                })
              }
              callback(domData)
              return domData
            }
            return loop(document)
          }
          const svgAttr = []
          const pattern = []
          domForEach(dom => {
            if (dom.tag === 'svg') {
              Object.keys(dom.attrs).forEach(key => {
                if (config.svgRules.allows.includes(key)) {
                  svgAttr.push(`\n${key}: '${dom.attrs[key]}'`)
                }
              })
              Object.keys(config.svgRules.attrs).forEach(key => {
                svgAttr.push(`\n${key}: '${config.svgRules.attrs[key]}'`)
              })
            }
            if (config.patternRules.map(p => p.name).includes(dom.tag)) {
              const tagData = config.patternRules.find(p => p.name === dom.tag)
              pattern.push(
                (() => {
                  if (dom.tag === 'text') {
                    return `\n<text${Object.keys(dom.attrs || {})
                      .map(key => {
                        return tagData.allows.includes(key) ? ` ${key}="${strFilter(dom.attrs[key])}"` : ''
                      })
                      .join('')}>${dom.children.map(child => child.text).join('')}</text>`
                  }
                  return `\n<${dom.tag}${Object.keys(dom.attrs || {})
                    .map(key => {
                      return tagData.allows.includes(key) ? ` ${key}="${strFilter(dom.attrs[key])}"` : ''
                    })
                    .join('')}/>`
                })()
              )
            }
          })
          const fsString =
            '' +
            'export default {' +
            `\nmount: '.icon-${'add'}',` +
            `\nattrs: {` +
            svgAttr.join(',') +
            `\n},` +
            `\npath: \`` +
            pattern.join('') +
            `\n\`` +
            '\n}\n'
          const newFilename = filename.replace('svg', 'js')
          const writeString = prettier.format(fsString, {
            semi: false,
            singleQuote: true,
            arrowParens: 'avoid',
            parser: 'babel',
          })
          fs.writeFile(path.resolve(path.resolve.apply(path, config.outputFolder), newFilename), writeString).then(
            () => {
              console.log(`Create svg ${newFilename} success.`.green)
              resolve()
            }
          )
        })
      })
    })
  ).then(() => {
    createIndex(config.outputFolder).then(() => {
      console.log('Create svg index success.'.green)
    })
  })
})
