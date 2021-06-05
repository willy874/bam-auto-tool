module.exports = {
  extends: 'DataModel',
  description: '',
  tebles: [
    {
      name: 'subject',
      type: String,
      default: '',
      description: '該筆文章的標題',
    },
    {
      name: 'content',
      type: String,
      default: '',
      description: '該筆文章的內容',
    },
    {
      name: 'status',
      type: String,
      default: '0',
      description: '該筆文章的狀態碼',
    },
    {
      name: 'sort',
      type: Number,
      default: 0,
      description: '該筆文章的排序',
    },
    {
      name: 'created_user',
      type: String,
      default: '',
      description: '該筆文章建立的使用者',
    },
    {
      name: 'updated_user',
      type: String,
      default: '',
      description: '該筆文章最後編輯的使用者',
    },
    {
      name: 'deleted_user',
      type: String,
      default: '',
      description: '該筆文章刪除的使用者',
    },
    {
      name: 'published_at',
      type: String,
      default: '',
      description: '該筆文章的公開時間',
    },
    {
      name: 'finished_at',
      type: String,
      default: '',
      description: '該筆文章的下架時間',
    },
  ],
}
