// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',     //手机号
    password:''    //密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(e){  //获取用户登录信息
    let type = e.currentTarget.dataset.type //data.key传值
    // console.log(e);
    this.setData({
      [type]:e.detail.value
    })
  },
  // 登录的回调
  login(){
    // 前端验证
    let {phone,password} = this.data
    //手机号为空
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return
    }
    //正则匹配
    let phonestr = /^1[3-8]\d{9}$/
    if(!phonestr.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon:'error'
      })
      return
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return
    }
    // wx.showToast({
    //   title: '前端验证通过',
      
    // })
   
    // 后端验证
    request('/login/cellphone',{phone,password}).then(res=>{
      // console.log(res.data);
      switch(res.data.code){
        case 200:
          wx.showToast({
            title: '登录成功',
          })
          //本地存储用户信息
          wx.setStorageSync('userInfo', JSON.stringify(res.data.profile))
          // 存储用户cookies
          wx.setStorageSync('cookies', res.cookies)
          // 跳转个人中心
          setTimeout(()=>{
            wx.reLaunch({
              url: '/pages/personal/personal',
            })
          },500)
         
          break;
        case 400:
          wx.showToast({
            title: '手机号错误',
            icon:'error'
          })
          break;
        case 502:
          wx.showToast({
            title: '密码错误',
            icon:'error'
          })
          break;
        default:
          wx.showToast({
            title: '登录失败，请重新登录',
            icon:'none'
          })
          
      }
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