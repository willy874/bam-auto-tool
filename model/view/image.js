import DataModel from '../proto/data'

/**
 * @extends DataModel
 * @property {Number} id 該Model的辨識索引
 * @property {String} name 該圖片的檔案名稱
 * @property {String} ext 該圖片的副檔名
 * @property {Number} sort 該圖片的排序
 * @property {String} type 該圖片的儲存類型
 * @property {Number} url 該圖片的檔案路徑
 * @property {String} alt 該圖片的替代文字
 * @property {String} title 該圖片的標題文字
 * @property {String} infomation 該圖片的資訊的json資料
 */
export default class ImageModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || 0
    this.name = entity.name || ''
    this.ext = entity.ext || ''
    this.sort = entity.sort || 0
    this.type = entity.type || ''
    this.url = entity.url || ''
    this.alt = entity.alt || ''
    this.title = entity.title || ''
    this.infomation = entity.infomation || ''
    // proto set
    this.api = 'image'
  }
}
