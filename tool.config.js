require('./scripts/index')({
  index: {
    input: [{
        path: 'model/view',
        type: 'cjs'
      },
      {
        path: 'model/schema',
        type: 'cjs'
      }
    ]
  },
  svg: {
    input: {
      path: 'svg/assets'
    },
    output: {
      path: 'svg/pattern'
    },
  }
})