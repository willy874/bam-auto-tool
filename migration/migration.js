module.exports = class Migration {
  constructor(args) {
    const entity = args ? args : {}
    this.connection = entity.connection
    this.file = entity.file
  }
}
