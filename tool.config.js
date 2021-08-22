const {
  FileName
} = require('bam-utility-plugins')

require('./scripts/index')({
  index: {
    input: [
      'model/schema',
      {
        path: 'model/view',
        type: 'esm',
        suffix: 'Model'
      },
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
    input: {
      path: 'model/schema'
    },
    output: {
      path: 'model/view',
      overwrite: {
        // exclude: [/\\image\./]
        // allow: [/\\image\./]
      }
    },
    overwrite: true
  },
})