const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  pageLifetimes: {
    show() {
      this.setData({
        playingId: parseInt(app.getPlayMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 当前选中
    onSelect(event){
      // console.log(event.currentTarget.dataset)
      const { musicid,index } = event.currentTarget.dataset
      this.setData({
        playingId: musicid
      })
      // 跳转到 播放页面
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicid}&index=${index}`,
      })
    }
  }
})