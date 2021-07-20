// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   bannerList:[],
   recommendList:[],
   topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    request('/banner',{type:2}).then(res=>{
     console.log(res)
     this.setData({
       bannerList:res.data.banners
     })
    })
    // 请求推荐歌曲数据
    request('/personalized',{limit:15}).then(res=>{
      // console.log(res);
      this.setData({
        recommendList:res.data.result
      })
    })
    let index = 0
    let resultArr=[]
    while(index<7){
      request('/top/list',{idx:index++}).then(res=>{
        let topListItem = {name:res.data.playlist.name,tracks:res.data.playlist.tracks.slice(0,3)}
        resultArr.push(topListItem)
        // 放在循环体里面，防止白屏时间过长
        this.setData({
          topList:resultArr
        })
      })
   
    }
   
  },
  handleUserInfo(res){
    console.log(res);
  },
  handleRecommend(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})