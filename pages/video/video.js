// pages/video/video.js


import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:'' , //获取导航id
    videoList:[],//视频数据
    videoId:'', //图片加载
    videoUpdateTime:[],//视频播放时间
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 获取导航数据
      request('/video/group/list').then(res=>{
        // console.log(res);
        this.setData({
          videoGroupList: res.data.data.slice(0,14),
          navId:res.data.data[0].id
        })
       //获取视频列表
      }).then(res=>{
        request('/video/group',{id:this.data.navId}).then(res=>{
          let index = 0
          let videoList = res.data.datas.map(item=>{
            item.id = index++
            return item
          })
          // console.log(res);
          this.setData({
              videoList:res.data.datas
            })
          })
        })
      
      //拿到id才能获取视频数据
  },
  navTap(event){
    let navId = event.currentTarget.id
    this.setData({
      navId:navId*1,
      videoList:[]  //点击先将上次视频清空
    })
    wx.showLoading({
      title:'正在加载'
    })  //S显示正在加载
    //点击切换视频
    request('/video/group',{id:navId}).then(res=>{
      let index = 0
    
      let videoList = res.data.datas.map(item=>{
        item.id = index++
        return item
      })
      wx.hideLoading() 
      this.setData({
        videoList:res.data.datas
      })
    })
 
  },
  //点击播放/暂停视频功能
  handlePlay(event){
    // 获取视频对象
    
    //打开下一个关闭上一个，同时打开当前的不关闭
    let vid = event.currentTarget.id
    this.vid!==vid && this.videoItem && this.videoItem.stop()
    this.vid = vid
    this.videoItem = wx.createVideoContext(vid)

    this.setData({
      videoId:vid
    })
    //继续上次播放位置
    let videoItemOld = this.data.videoUpdateTime.find(item=>item.vid === vid)
    
    if(videoItemOld){
      this.videoItem.seek(videoItemOld.currentTime)
      // if(videoItem.flag){
      //   this.videoItem.play()
      //   videoItemOld.flag = false
      // }
    }else{
     
      this.videoItem.play()
    }
    
    //  this.videoItem.play()
  },
  //监听视频播放进度
  handleSwitch(event){
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime,flag:true};
    let videoItem = this.data.videoUpdateTime.find(item=>item.vid === videoTimeObj.vid)
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime
    }else{
      this.data.videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime:this.data.videoUpdateTime
    })
  },
  //监听视频播放完成
  handleEnded(event){
    let {videoUpdateTime} = this.data
    let index = videoUpdateTime.findIndex(item=>item.vid === event.currentTarget.id)
    videoUpdateTime.splice(index,1)
    this.setData({
      videoUpdateTime
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