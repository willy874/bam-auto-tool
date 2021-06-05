const Blueprint = require('./blueprint')

/**
 * Schema 負責執行 Blueprint
 */
module.exports = class Schema {
  constructor() {}
  static async create(migration, action) {
    const table = new Blueprint(migration)
    action(table)
    await table.modelWrite()
    return await table.queryCreate()
  }
  static async update(migration, action) {
    const table = new Blueprint(migration)
    action(table)
    await table.modelWrite()
    return await table.queryUpdate()
  }
  static async drop(migration, action) {
    const table = new Blueprint(migration)
    action(table)
    return await table.queryDrop()
  }
}
