module.exports = {
  dbRelation: true,
  tebles: [
    {
      name: 'id',
      type: Number,
      default: NaN,
      description: '該Model的辨識索引'
    },
    {
      name: 'image_id',
      type: Number,
      default: NaN,
      description: '關聯的的圖片辨識索引'
    },
    {
      name: 'relation_name',
      type: String,
      default: '',
      description: '關聯的資料表'
    },
    {
      name: 'relation_id',
      type: Number,
      default: NaN,
      description: '關聯的資料表辨識索引'
    }
  ]
}
