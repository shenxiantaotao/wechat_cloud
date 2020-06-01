// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: [],
    listInfo: {}
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log('musiclist:  ')
    console.log(options)
    this.getMusicList(options)
  },

  // 获取歌单详情
  getMusicList({
    playlistId
  }) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        playlistId
      }
    }).then((res) => {
      const {
        tracks,
        coverImgUrl,
        name
      } = res.result.playlist;
      this.setData({
        musicList: tracks,
        listInfo: {
          coverImgUrl,
          name
        }
      })
      // set musicList
      this._setMusiclist();
      wx.hideLoading()
    })
  },

  // 设置歌单播放页的数据
  _setMusiclist(){
    wx.setStorageSync('musiclist', this.data.musicList)
  },


  // 用户点击右上角分享
  onShareAppMessage() {

  }
})