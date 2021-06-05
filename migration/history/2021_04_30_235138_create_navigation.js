const Migration = require('../migration')
const Schema = require('../schema')
const Blueprint = require('../blueprint')

module.exports = class NavigationTable extends Migration {
  constructor(args) {
    const entity = args ? args : {}
    super({
      connection: entity.connection,
      file: entity.file,
    })
    this.tableName = 'navigation'
  }
  up() {
    return Schema.create(this, (table = new Blueprint()) => {
      table.id()
      table.varchar('uuid', 6)
      table.varchar('title', 255).setNullable()
      table.int('sort').setDefault(0)
      table.varchar('path', 255)
      table.varchar('model', 255).setNullable()
      table.varchar('component', 255).setNullable()
      table.varchar('parent', 255).setNullable()
      table.varchar('alias', 255).setNullable()
      table.varchar('group_name', 255).setNullable()
      table.text('icon').setNullable()
    })
  }
  down() {
    return Schema.drop(this, (table = new Blueprint()) => {
      table.drop()
    })
  }
}
