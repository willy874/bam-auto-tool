const Migration = require('../migration')
const Schema = require('../schema')
const Blueprint = require('../blueprint')

module.exports = class ImageRelationTable extends Migration {
  constructor(args) {
    const entity = args ? args : {}
    super({
      connection: entity.connection,
      file: entity.file,
    })
    this.tableName = 'image_relation'
  }
  up() {
    return Schema.create(this, (table = new Blueprint()) => {
      table.id()
      table.int('image_id', 10).setForeignKey()
      table.varchar('relation_name', 255)
      table.int('relation_id', 10)
    })
  }
  down() {
    return Schema.drop(this, (table = new Blueprint()) => {
      table.drop()
    })
  }
}
