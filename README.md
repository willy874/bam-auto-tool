# BAM AUTO TOOL

## 使用方式

1. 在 root 建立 `tool.config.js`
2. 對應的工具建立對應的物件名稱，將其 config 寫入。
3. 在 `package.json` 的 `scripts` 加入指令執行 `node tool.config.js`。

```js
require('bam-auto-tool')({
  index: {},
  svg: {},
  model: {},
  ckeditor: {},
})
```

```json
package.json
{
  "scripts": {
    "tool": "node tool.config.js"
  }
}
```

## Create Index

該工具用來建立資料夾的索引檔，可以選擇使用 ESM 或是 CJS，預設採用 ESM 模式。

### 設定建立範例

```js
// tool.config.js
const indexConfig = {
  input: [
    'folder/filenA',
    {
      path: 'filenB',
      fileNameHandler: filename => {
        return rename(filename)
      },
    },
  ],
  output: {
    type: 'cjs',
  },
}
```

### input API

| name            | type                    | default                 | description                               |
| --------------- | ----------------------- | ----------------------- | ----------------------------------------- |
| input           | Object , Array , String | undefined               | input path or input setting.              |
| output          | Object , Array , String | undefined               | output setting.                           |
| path            | String                  | \`${root}\`             | if input not string, index folder folder. |
| type            | String                  | 'esm'                   | file type,support cjs & esm.              |
| prefix          | String                  | ''                      | file ouput name, prefix text.             |
| suffix          | String                  | ''                      | file ouput name, suffix text.             |
| filename        | String                  | index.js                | index file name.                          |
| fileNameHandler | Function                | (f) => ConverBigHump(f) | file ouput name,fix rule.                 |

### 規則

- 當 input、output 的設定衝突時，以 input 的設定優先。
- path 會自動加上 root，以 cmd 指令的位置為準。
- filename 只能在 output 使用

### 指令

```bash
$ npm run tool index
```

## Create Model

## Conver SVG assets

## Create ckeditor bundle

## MySQL migration
