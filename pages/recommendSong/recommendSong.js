// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//天
    month:'',//月
    recommendList:[], //歌曲数据
    index:0 //切歌时歌曲索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
      //跳转登陆页面
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    //获取歌曲数据
    request('/recommend/songs').then(res=>{
      // console.log(res.data.recommend);
      this.setData({
        recommendList:res.data.recommend
      })
    })
    PubSub.subscribe('getMore',(msg,flag)=>{
      // console.log(flag);
      PubSub.publish('send',this.data.recommendList)
    })
   
  
    //订阅者获取播放页面上一首下一首数据
    PubSub.subscribe('switchSong',(msg,type)=>{
      
      let {recommendList,index} = this.data
      if(type === 'pre'){//上一首
        //如果是第一首歌，就切换最后一首
        index =index === 0?recommendList.length:index
        index--
      }else{
        index = index+1 ===recommendList.length?-1:index
        index++
      }
      //更新index
      this.setData({
        index
      })
        //发布者传递要播放的歌曲
      let muid = recommendList[index].id
      PubSub.publish('musicName',muid)
    })
  
  },
  handleSong(e){
    let song = e.currentTarget.dataset.song
    let index = e.currentTarget.dataset.index
    this.setData({
      index
    })
    //发布歌曲列表传递
    // PubSub.publish('listSong',this.data.recommendList)
   
    // console.log(this.data.recommendList);
    // console.log(song);
    wx.navigateTo({
      //跳转路由传参,要转化为JSON格式，且长度有限制，不适合。
      url: '/pages/songPlay/songPlay?musicId='+ song.id
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