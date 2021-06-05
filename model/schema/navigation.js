const prototype = {
  rules() {
    return {}
  },
}

module.exports = {
  prototype,
  extends: 'DataModel',
  tebles: [
    {
      name: 'id',
      type: Number,
      default: 0,
      description: '該Model的辨識索引',
    },
    {
      name: 'uuid',
      type: String,
      default: '',
      description: '路由的唯一碼',
    },
    {
      name: 'name',
      type: String,
      default: '',
      description: '路由的名稱',
    },
    {
      name: 'title',
      type: String,
      default: '',
      description: '路由的標題',
    },
    {
      name: 'sort',
      type: Number,
      default: '',
      description: '路由的排序',
    },
    {
      name: 'path',
      type: String,
      default: '',
      description: '路由的路徑',
    },
    {
      name: 'model',
      type: String,
      default: '',
      description: '路由使用的模型',
    },
    {
      name: 'component',
      type: String,
      default: '',
      description: '路由使用的組件',
    },
    {
      name: 'parent',
      type: String,
      default: '',
      description: '路由的父組件對象',
    },
    {
      name: 'alias',
      type: String,
      default: '',
      description: '路由的代名',
    },
    {
      name: 'group_name',
      type: String,
      default: '',
      description: '路由的群組分類',
    },
    {
      viewRelation: true,
      name: 'icon',
      type: 'ImageModel',
      description: '路由使用的Icon圖片',
    },
  ],
}
