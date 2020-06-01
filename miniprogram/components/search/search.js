let keyword = ''

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  // 接受父组件传入的confront class图标
  externalClasses: ["iconfont", "icon-sousuo"],
  /**
   * 组件的方法列表
   */
  methods: {
    // 搜索
    onSearch() {
      this.triggerEvent('search', keyword)
    },
    // input change 
    onInput(event) {
      const {
        value
      } = event.detail
      keyword = value
    }
  }
})