const path = require('path')
const fs = require('fs').promises
const {
  FileName
} = require('bam-utility-plugins')

const readDirectory = args => {
  return Promise.all(
    args.dir.map(async file => {
      const baseUrl = args.baseUrl
      const urlList = [...args.urlList, file]
      const url = path.join(args.baseUrl, ...urlList)
      const stat = await fs.stat(url)
      const filename = new FileName(file)
      if (stat.isFile()) {
        const type = /\./.test(filename.name) ? 'file' : 'none'
        const fileData = {
          url,
          name: filename.name,
          ext: type === 'none' ? 'none' : filename.ext,
          type,
          size: stat.size,
          createTime: stat.birthtime,
          updateTime: stat.mtime
        }
        if (args.callback) await args.callback(fileData.url, fileData)
        return fileData
      } else {
        return {
          name: filename,
          type: 'dir',
          child: await readDirectory({
            callback: args.callback,
            url,
            baseUrl,
            urlList,
            stat,
            dir: await fs.readdir(url)
          })
        }
      }
    })
  )
}



module.exports = async function (filePath, callback) {
  return await readDirectory({
    callback,
    baseUrl: filePath,
    urlList: [],
    stat: await fs.stat(filePath),
    dir: await fs.readdir(filePath)
  })
}