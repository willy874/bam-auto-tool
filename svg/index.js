const fs = require('fs').promises
const path = require('path')
const prettier = require('prettier')
const parse5 = require('parse5')
const defaultConfig = require('./config')
const createIndex = require('../create-index/create-webpack')
const {
  Observable,
  FileName
} = require('bam-utility-plugin')

const resolvePath = (url) => {
  return path.join(process.cwd(), ...url.split(/\/|\\/))
}

const parseDomMap = (document, callback) => {
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

const getDomAttr = (dom, key) => {
  return ` ${key}="${dom.attrs[key].replace(/\r\n|\n|\t/g, '')}"`
}

module.exports = async function (paramsConfig) {
  const config = Object.assign(defaultConfig, paramsConfig, {
    svgRules: Object.assign(defaultConfig.svgRules, paramsConfig.svgRules),
    patternRules: (function () {
      if (paramsConfig.patternRules && Array.isArray(paramsConfig.patternRules)) {
        paramsConfig.patternRules.forEach(rule => {
          const target = defaultConfig.patternRules.find(p => p.name === rule.name)
          if (target) {
            Object.assign(target, rule)
          } else {
            defaultConfig.patternRules.push(rule)
          }
        })
      }
      return defaultConfig.patternRules
    })(),
  })
  const inputFolderPath = config.input.path || config.input
  const outputFolderPath = config.output.path || config.output
  fs.readdir(resolvePath(inputFolderPath)).then(filenames => {
    new Observable(subscriber => {
      filenames.forEach(filename => {
        if (/\.svg$/.test(filename)) {
          subscriber.next(async () => {
            const fileData = await fs.readFile(path.join(resolvePath(inputFolderPath), filename))
            const document = parse5.parse(fileData.toString())
            const svgAttr = []
            const pattern = []
            try {
              parseDomMap(document, dom => {
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
                    (dom.tag === 'text') ? (
                      `\n<text${Object.keys(dom.attrs || {})
                      .map(key => {
                        return tagData.allows.includes(key) ? getDomAttr(dom,key) : ''
                      })
                      .join('')}>${dom.children.map(child => child.text).join('')}</text>`
                    ) : (
                      `\n<${dom.tag}${Object.keys(dom.attrs || {})
                      .map(key => {
                        return tagData.allows.includes(key) ? getDomAttr(dom,key) : ''
                      })
                      .join('')}/>`
                    )
                  )
                }
              })
            } catch (error) {
              console.log('error', error)
            }
            const filenameData = new FileName(filename)
            const fsString = 'export default {' +
              `\nmount: '.icon-${filenameData.data.join('-')}',` +
              `\nattrs: {` +
              svgAttr.join(',') +
              `\n},` +
              `\npath: \`` +
              pattern.join('') +
              `\n\`` +
              '\n}\n'
            const newFilename = filenameData.data.join('-') + '.js'
            const newFilePath = path.join(outputFolderPath, newFilename)
            const writeString = prettier.format(fsString, {
              semi: false,
              singleQuote: true,
              arrowParens: 'avoid',
              parser: 'babel',
            })
            await fs.writeFile(newFilePath, writeString)
            console.log(`Create svg ${newFilename} success.`.green)
          })
        }
      })
      subscriber.error(() => {
        console.log('Observable error'.red)
      })
      subscriber.complete(() => {
        createIndex(outputFolderPath)
      })
    }).run()
  })
}