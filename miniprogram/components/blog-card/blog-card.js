import formatTime from '../../utils/formatTime.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
      // console.log(1)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {
      const {
        imgs,
        imgsrc
      } = event.target.dataset
      wx.previewImage({
        urls: imgs,
        current: imgsrc
      })
    }
  }
})