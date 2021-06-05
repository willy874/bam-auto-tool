import DataModel from '../proto/data'
import { ImageModel } from './index'

/**
 * @extends DataModel
 * @property {Number} id 該Model的辨識索引
 * @property {String} uuid 路由的唯一碼
 * @property {String} name 路由的名稱
 * @property {String} title 路由的標題
 * @property {Number} sort 路由的排序
 * @property {String} path 路由的路徑
 * @property {String} model 路由使用的模型
 * @property {String} component 路由使用的組件
 * @property {String} parent 路由的父組件對象
 * @property {String} alias 路由的代名
 * @property {String} group_name 路由的群組分類
 * @property {ImageModel} icon 路由使用的Icon圖片
 */
export default class NavigationModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.id = entity.id || 0
    this.uuid = entity.uuid || ''
    this.name = entity.name || ''
    this.title = entity.title || ''
    this.sort = entity.sort || ''
    this.path = entity.path || ''
    this.model = entity.model || ''
    this.component = entity.component || ''
    this.parent = entity.parent || ''
    this.alias = entity.alias || ''
    this.group_name = entity.group_name || ''
    this.icon = new ImageModel(entity.icon)
    // proto set
    this.api = 'navigation'
  }
}
