const path = require('path')
const {
  FileName
} = require('bam-utility-plugins')

require('./scripts/index')({
  index: {
    input: [
      'model/view',
      'model/schema',
      {
        path: 'utility',
        fileNameHandler: f => {
          return new FileName(f).ConverLittleHump()
        }
      }
    ],
    output: {
      type: 'cjs',
    }
  },
  svg: {
    input: {
      path: 'svg/assets'
    },
    output: {
      path: 'svg/pattern'
    },
  },
  model: {
    input: 'model/schema',
    output: {
      path: 'model/view',
      overwrite: {
        // exclude: [/\\image\./]
        // allow: [/\\image\./]
      }
    },
    overwrite: true
  },
  ckeditor: {
    input: 'ckeditor/ckeditor.js',
    output: 'ckeditor/build',
    filename: 'ckeditor.js'
  }
})