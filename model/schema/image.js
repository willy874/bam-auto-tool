module.exports = {
  extends: 'DataModel',
  tebles: [
    {
      name: 'id',
      type: Number,
      default: 0,
      description: '該Model的辨識索引',
    },
    {
      name: 'name',
      type: String,
      default: '',
      description: '該圖片的檔案名稱',
    },
    {
      name: 'ext',
      type: String,
      default: '',
      description: '該圖片的副檔名',
    },
    {
      name: 'sort',
      type: Number,
      default: 0,
      description: '該圖片的排序',
    },
    {
      name: 'type',
      type: String,
      default: '',
      description: '該圖片的儲存類型',
    },
    {
      name: 'url',
      type: Number,
      default: '',
      description: '該圖片的檔案路徑',
    },
    {
      name: 'alt',
      type: String,
      default: '',
      description: '該圖片的替代文字',
    },
    {
      name: 'title',
      type: String,
      default: '',
      description: '該圖片的標題文字',
    },
    {
      name: 'infomation',
      type: String,
      default: '',
      description: '該圖片的資訊的json資料',
    },
  ],
}
