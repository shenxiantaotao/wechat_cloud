// 入口文件
App({
  onLaunch: function () {
    // 判断当前是否支持小程序云开发    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      // 初始化源开发
      wx.cloud.init({
        env: 'wechatcloud-fk7d8',
        traceUser: true,
      })
    }
    // 可以理解为vuex or redux 也就是当成全局的状态参数存储
    this.globalData = {
      playingMusicId: -1,
      openid: -1,
    }
  },

  setPlayMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  
  getPlayMusicId() {
    return this.globalData.playingMusicId
  }
})
