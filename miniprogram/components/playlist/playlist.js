// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object,
    }
  },


  observers: {
    ['playlist.playCount'](count) {
      let _count = this._tranNumber(count, 2)
      this.setData({
        _count
      })
      // console.log('查看当前是否会一直输出');
    }
  },

  // 组件的初始数据
  data: {
    _count: 0
  },

  // 组件的方法列表
  methods: {
    // 装换playlist中count
    _tranNumber(num, point) {
      // 首先过滤掉小数点 例如 201000.2
      let numStr = num.toString().split('.')[0]
      let len = numStr.length;
      if (len < 6) {
        return numStr; // 十万以下走默认
      } else if (len >= 6 && len <= 8) {
        let _index = len - 4;
        let decimal = numStr.substring(_index, _index + point);
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
      } else if (len > 8) {
        let _index = len - 8;
        let decimal = numStr.substring(_index, _index + point);
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    },

    // 推荐列表点击 挑战到歌单详情
    goToMusiclist() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${ this.properties.playlist.id }`,
      })
    }
  }
})