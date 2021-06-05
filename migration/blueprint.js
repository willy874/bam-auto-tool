const TableColumn = require('./table-column')
const { queryCreate, queryDrop, modelWrite } = require('./sql-query')

/**
 * Blueprint 負責操作資料庫
 */
module.exports = class Blueprint {
  constructor(args) {
    const entity = args ? args : {}
    this.BlueprintConnection = entity.connection
    this.BlueprintTableName = entity.tableName
    this.BlueprintFile = entity.file
    this.BlueprintTables = []
    this.BlueprintDrop = null
    // prototype methods
    this.queryCreate = queryCreate
    this.queryDrop = queryDrop
    this.modelWrite = modelWrite
  }
  /**
   * 建立主鍵，預設為 int 纇型，長度 10，AUTO_INCREMENT。
   */
  id() {
    const table = new TableColumn({
      name: 'id',
      type: 'int',
      length: 10,
      primaryKey: true,
      tables: this.BlueprintTables,
      default: undefined,
      auto: true,
      nullable: false,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 4 位元組整數：若允許負數，範圍由 -2,147,483,648 至 2,147,483,647；若不允許負數，範圍由 0 至 4,294,967,295
   */
  int(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'int' || 2147483647,
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 1 位元組整數：若允許負數，範圍由 -128 至 127；若不允許負數，範圍由 0 至 255
   */
  tinyInt(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'tinyInt',
      length: length || 255,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 2 位元組整數：若允許負數，範圍由 -32,768 至 32,767；若不允許負數，範圍由 0 至 65,535
   */
  smallInt(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'smallInt',
      length: length || 65535,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 3 位元組整數：若允許負數，範圍由 -8,388,608 至 8,388,607；若不允許負數，範圍由 0 至 16,777,215
   */
  mediumInt(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'mediumInt',
      length: length || 16777215,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 8 位元組整數：若允許負數，範圍由 -9,223,372,036,854,775,808 至 9,223,372,036,854,775,807；若不允許負數，範圍由 0 至 18,446,744,073,709,551,615
   */
  bigInt(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'bigInt',
      length: length || 18446744073709552000,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 倍準浮點數，範圍為 -1.7976931348623157E+308 至 -2.2250738585072014E-308、0 及 2.2250738585072014E-308 至 1.7976931348623157E+308
   */
  double(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'double',
      length: length || 1.7976931348623157e308,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 位元欄類型 (M)，每個值使用 M 個位元 (預設值為 1，最大值為 64)
   */
  bit(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'bit',
      length: length || 64,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 日期，有效範圍為 1000-01-01 至 9999-12-31
   */
  date(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'date',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 日期與時間組合，有效範圍為 1000-01-01 00:00:00 至 9999-12-31 23:59:59
   */
  datetime(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'datetime',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 時間戳記，有效範圍為 1970-01-01 00:00:01 UTC 至 2038-01-09 03:14:07 UTC，以自 1970-01-01 00:00:00 UTC 計算的秒數儲存
   */
  timestamp(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'timestamp',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 時間，有效範圍為 -838:59:59 至 838:59:59
   */
  time(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'time',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 以 4 位數 (預設) 或 2 位數的方式表示年份，有效範圍為 70 (1970年) 至 69 (2069年) 或 1901 至 2155 和 0000
   */
  year(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'year',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 固定長度 (0 至 255，預設為 1) 的字串，在儲存長度不足時會在右邊以空格補足
   */
  cart(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'cart',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 可變長度 (0-65,535) 的字串，實際的最大長度需視資料列大小限制而定
   */
  varchar(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'varchar',
      length: length || 535,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 純文字(TEXT)欄位，最大長度為 65,535 (2^16 - 1) 個字元，儲存時會附加 2 個位元組在最前面用來記錄長度
   */
  text(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'text',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 純文字(TEXT)欄位，最大長度為 255 (2^8 - 1) 個字元，儲存時會附加 1 個位元組在最前面用來記錄長度
   */
  tinyText(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'tinyText',
      length: length || 255,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 純文字(TEXT)欄位，最大長度為 16,777,215 (2^24 - 1) 個字元，儲存時會附加 3 個位元組在最前面用來記錄長度
   */
  mrdiumText(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'mrdiumText',
      length: length || 16777215,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 純文字(TEXT)欄位，最大長度為 4,294,967,295 或 4GiB (2^32 - 1) 個字元，儲存時會附加 4 個位元組在最前面用來記錄長度
   */
  longText(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'longText',
      length: length || 4294967295,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 類似 CHAR 類型，但此類型以二進位的方式儲存字串，而不是字元
   */
  binary(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'binary',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 類似 VARCHAR 類型，但此類型以二進位的方式儲存字串，而不是字元
   */
  varbinary(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'varbinary',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 大型二進位物件(BLOB)欄位，最大長度為 255 (2^8 - 1) 個位元組，儲存時會附加 1 個位元組在最前面用來記錄長度
   */
  tinyBlob(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'tinyBlob',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 大型二進位物件(BLOB)欄位，最大長度為 16,777,215 (2^24 - 1) 個位元組，儲存時會附加 3 個位元組在最前面用來記錄長度
   */
  mrdiumBlob(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'mrdiumBlob',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 大型二進位物件(BLOB)欄位，最大長度為 65,535 (2^16 - 1) 個位元組，儲存時會附加 2 個位元組在最前面用來記錄長度
   */
  blob(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'blob',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 大型二進位物件(BLOB)欄位，最大長度為 4,294,967,295 或 4GiB (2^32 - 1) 個位元組，儲存時會附加 4 個位元組在最前面用來記錄長度
   */
  longBlob(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'longBlob',
      length,
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 列舉類型(ENUM)，在清單中最多可有 65,535 個值或特殊 '' 錯誤值
   */
  enum(name, length, defaultData) {
    const table = new TableColumn({
      name,
      type: 'enum',
      length: length.map(s => `'${s}'`).join(','),
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  /**
   * 儲存並開啟對 JSON (JavaScript Object Notation) 文件資料的快速存取
   */
  json(name, defaultData) {
    const table = new TableColumn({
      name,
      type: 'json',
      tables: this.BlueprintTables,
      default: defaultData,
    })
    this.BlueprintTables.push(table)
    return table
  }
  drop(key) {
    if (this.BlueprintDrop === null) {
      this.BlueprintDrop = []
    }
    if (key) {
      this.BlueprintDrop.push(key)
    }
  }
}
