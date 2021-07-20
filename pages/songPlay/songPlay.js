// pages/songPlay/songPlay.js
//要先在工具下构建npm，小程序才能加载第三方模块
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
//导入全局对象
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//是否在播放
    song:{},  //歌曲详情
    musicId:'',
    musicLink:'',
    currentTime:"00:00",//歌曲时间
    allTime:'00:00',
    currentWidth:'',
    isMode:true,//播放模式
    isMore:false,
    asongList:[],//当前列表歌单
    test:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //opyions接受路由传参
    let songId = options.musicId
    this.setData({
      musicId:songId
    })
    
    // console.log(options);
    // console.log(songId);
    this.getSong(songId)
   //获取数据
  
    
    // console.log('a');
    //判断上一首歌是否在播放
    // console.log(appInstance.isOuterPlay)
    // console.log(songId ==appInstance.musicPlayId);
    // console.log(songId)
    // console.log(appInstance.musicPlayId);
    if(songId == appInstance.musicPlayId && appInstance.isOuterPlay){
      this.setData({
        isPlay:true
      })
    }
    
    // 问题：真实音乐播放和页面播放不匹配的问题。获取播放事件
    this.audio = wx.getBackgroundAudioManager()
    // 播放
    this.audio.onPlay(
      ()=>{
        this.setData({
          isPlay:true
        })
        appInstance.musicPlayId = this.data.musicId
        appInstance.isOuterPlay = true
      }
    )
    //暂停
    this.audio.onPause(
      ()=>{
        this.setData({
          isPlay:false
        })
        appInstance.isOuterPlay = false
      }
    )
    // 停止
    this.audio.onStop(
      ()=>{
        this.setData({
          isPlay:false
        })
        appInstance.isOuterPlay = false
      }
    )
    //自动播放下一首
    this.audio.onEnded(()=>{
      PubSub.publish('switchSong','next')
      this.setData({
        currentWidth:'0',
        currentTime:'00:00'
      })
      PubSub.subscribe('musicName',(mag,muid)=>{
        // console.log(muid);
        this.setData({
          musicId:muid
        })
        //获取歌曲
        this.getSong(muid)
        //自动播放
        this.songPlay(true,muid)
        PubSub.unsubscribe('musicName')//每次要先取消一次，防止重复执行
  
      })
    })
    //监听实时播放
    this.audio.onTimeUpdate(()=>{
      let currentTime = moment(this.audio.currentTime *1000).format('mm:ss')
      let currentWidth = this.audio.currentTime / this.audio.duration *450
      if(this.data.musicId != appInstance.musicPlayId){
        this.setData({
          currentTime:'00:00',
          currentWidth:'0'
        })
      }else{
        this.setData({
          currentTime,
          currentWidth
        })
      }
     
    })
  },
//控制歌曲播放
  handlePlay(){
    let play = !this.data.isPlay
    //取反
    // this.setData({
    //   isPlay:play
    // })
    this.songPlay(play,this.data.musicId,this.data.musicLink)
  },
  //真实音乐播放
  songPlay(isPlay,id,musicUrl){
    if(isPlay){
      //发送请求
      if(!musicUrl){
        this.p= request('/song/url',{id}).then(res=>{
          // console.log(res);
          musicUrl = res.data.data[0].url
          this.setData({
            musicLink:musicUrl
          })
        })
      }
    //如果第一次播放
      
        this.p.then(res=>{
          this.audio.src = musicUrl
          this.audio.title = this.data.song.name
        })
        
      
        // //获取音乐播放对象      
        // this.audio.src = this.data.musicLink
        // this.audio.title = this.data.song.name
    }else{//暂停
      this.audio.pause()
    }
  },
  // 获取歌曲详情
  getSong(id){
    request('/song/detail',{ids:id}).then(res=>{
      let allTime = moment(res.data.songs[0].dt).format('mm:ss')
      this.setData({
        song:res.data.songs[0],
        allTime
      })
      wx.setNavigationBarTitle({
        title: this.data.song.name
      })
    })
   
  },
  //点击切换歌曲
  handleSwitch(event){
    let type = event.currentTarget.id
    let mode =this.data.isMode
    // this.play.type = type
    // this.play.mode = mode
    //关闭上一首歌
    this.audio.stop()
    //发布者传递切歌类型
    PubSub.publish('switchSong',type)
    //订阅者获取歌曲
    PubSub.subscribe('musicName',(mag,muid)=>{
      // console.log(muid);
      this.setData({
        musicId:muid
      })
      //获取歌曲
      this.getSong(muid)
      //自动播放
      this.songPlay(true,muid)
      PubSub.unsubscribe('musicName')//每次要先取消一次，防止重复执行

    })
    
  },
  //切换模式
  handleMode(){
    let mode = !this.data.isMode
    this.setData({
      isMode:mode
    })
  },
  //更多歌曲
  handleMore(){
    let more =!this.data.isMore
    this.setData({
      isMore:more
    })
    PubSub.publish('getMore',this.data.test)
    PubSub.subscribe('send',(msg,songs1)=>{
      // console.log(songs1)
      this.setData({
        asongList:songs1
      })
      PubSub.unsubscribe()
    })
   
   
  },
  handleHidden(){
    let isMore = false
    this.setData({
      isMore
    })
  },
  //推荐页面播放
  handlePlaySong(e){
    let id = e.currentTarget.dataset.id
    this.getSong(id)
    this.songPlay(true,id)
    this.setData({
      isMore:false
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