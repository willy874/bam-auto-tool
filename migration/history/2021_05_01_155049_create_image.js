const Migration = require('../migration')
const Schema = require('../schema')
const Blueprint = require('../blueprint')

module.exports = class ImageTable extends Migration {
  constructor(args) {
    const entity = args ? args : {}
    super({
      connection: entity.connection,
      file: entity.file,
    })
    this.tableName = 'image'
  }
  up() {
    return Schema.create(this, (table = new Blueprint()) => {
      table.id()
      table.varchar('name', 255)
      table.varchar('type', 255).setNullable()
      table.int('size').setNullable()
      table.int('sort').setDefault(0)
      table.varchar('image_name', 255).setNullable()
      table.varchar('image_ext', 255).setNullable()
      table.varchar('image_url', 255).setNullable()
      table.varchar('image_alt', 255).setNullable()
      table.varchar('image_title', 255).setNullable()
    })
  }
  down() {
    return Schema.drop(this, (table = new Blueprint()) => {
      table.drop()
    })
  }
}
