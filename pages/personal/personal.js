import request from '../../utils/request'

// pages/personal/personal.js
let StartY = 0
let MoveY = 0
let EndY = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
      translatey:'translateY(0)',
      coverTransition:'',
      userInfo:{},
      recentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userMessage = wx.getStorageSync('userInfo')
    // 获取本地用户数据
    if(userMessage){
      this.setData({
        userInfo:JSON.parse(userMessage)
      })
      //获取用户最近播放数据`
      let userId = this.data.userInfo.userId
      request('/user/record',{uid:userId,type:1}).then(res=>{
        let index = 0
        let recentPlayList = res.data.weekData.splice(0,10).map(item=>{
          item.id = index++;
          return item;
        })
       
        this.setData({
          recentPlayList
        })
      })
    }
   
  },
  handleTouchStart(event){
    StartY = event.touches[0].clientY
    this.setData({
      coverTransition:''
    })
  },
  handleTouchMove(event){
    MoveY = event.touches[0].clientY ;
    let moveDistance = MoveY- StartY;
    if(moveDistance<0){
      moveDistance = 0
    }
    if(moveDistance>80){
      moveDistance = 80
    }
    this.setData({
      translatey :`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(event){
    this.setData({
      translatey :'translateY(0rpx)',
      coverTransition:'all 1s linear'
    })
  },
  // 跳转到登录页
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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