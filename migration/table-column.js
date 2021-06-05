module.exports = class TableColumn {
  constructor(args) {
    const entity = args || {}
    this.tables = entity.tables
    this.name = entity.name
    this.type = entity.type
    this.length = entity.length
    this.primaryKey = entity.primaryKey
    this.foreignKey = entity.foreignKey
    this.default = entity.default
    this.auto = entity.auto
    this.nullable = entity.nullable
  }
  setName(str) {
    this.name = str
    return this
  }
  setLength(num) {
    this.length = num
    return this
  }
  setType(str) {
    this.type = str
    return this
  }
  setDefault(data) {
    this.default = data
    return this
  }
  setNullable() {
    this.null = true
    return this
  }
  setAuto() {
    this.auto = true
    return this
  }
  setPrimaryKey() {
    const target = this.tables.find(t => t.primaryKeyName)
    if (target) target.primaryKey = false
    this.primaryKey = true
    return this
  }
  setForeignKey(table, key) {
    if (this.foreignKey === undefined) {
      this.foreignKey = []
    }
    const tableName = table || this.name
    const foreignTable = tableName.split('_')[0]
    const foreignTableKey = tableName.split('_')[1]
    this.foreignKey.push({
      name: this.name,
      table: table || foreignTable,
      key: key || foreignTableKey || 'id',
    })
    return this
  }
}
