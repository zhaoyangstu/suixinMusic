// pages/search/search.js
import request from '../../utils/request'
import pubsub from 'pubsub-js'
let timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'',//placeholder值
    hotSongList:[], //热歌榜单
    inputContent:'',
    searchList:[], //搜索列表
    historyList:[],//历史数据,
    index:0 //切歌索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotSong()
    this.getHistory()
  },
  getHistory(){
    let historyStorage = wx.getStorageSync('historyList')
    if(historyStorage){
      this.setData({
        historyList:historyStorage
      })
    }
  
  },
  //获取热搜歌数据
  getHotSong(){
    request('/search/default').then(res=>{
      this.setData({
        placeholder:res.data.data.showKeyword
      })
    })
    request('/search/hot/detail').then(res=>{
      // console.log(res.data.data);
      this.setData({
        hotSongList:res.data.data
      })
    })
  },
  //处理input事件
  handleInput(event){  //这里加async会出问题，搜索框出现promise
    // console.log(event);
   
    let inputContent = event.detail.value.trim()//获取输入内容
    this.setData({
      inputContent
    })
    if(!this.data.inputContent){
      this.setData({
        searchList:[]
      })
      return
    }
    //发送请求
    //防抖实现
    // request('/search',{keywords:this.data.inputContent,limit:10}).then(res=>{
    //   let searchList = res.data
    //   console.log(searchList);
    //   this.setData({
    //     searchList
    //   })
    if(timer!=null){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      request('/search',{keywords:this.data.inputContent,limit:10}).then(res=>{
        let searchList = res.data.result.songs
        // console.log(searchList);
        this.setData({
          searchList
        })
        pubsub.subscribe('getMore',(msg,searchSong)=>{
          pubsub.publish('send',this.data.searchList)
        })
        pubsub.subscribe('switchSong',(msg,type)=>{
          let {searchList,index} = this.data
          if(type === 'pre'){//上一首
            //如果是第一首歌，就切换最后一首
            index =index === 0?searchListList.length:index
            index--
          }else{
            index = index+1 === searchList.length?-1:index
            index++
          }
          //更新index
          this.setData({
            index
          })
            //发布者传递要播放的歌曲
          let muid = searchList[index].id
          pubsub.publish('musicName',muid)
        })
        //搜索历史记录
        let {historyList,inputContent} = this.data
        //如果输入相同的内容，则不输出
        if(historyList.indexOf(inputContent) !==-1){
          historyList.splice(historyList.indexOf(inputContent),1)
        }
        historyList.unshift(inputContent)
        this.setData({
          historyList
        })
        if(inputContent){
          wx.setStorageSync('historyList', this.data.historyList)
        }
       
      })
     
    }, 300);
  },
  //跳转播放
  handleSearch(e){
    let id = e.currentTarget.id
    // console.log(id);
    wx.navigateTo({
      url: '/pages/songPlay/songPlay?musicId='+id,
    })
  },
  //清空搜索框
  handleClear(){
    this.setData({
      inputContent:'',
      searchList:[]
    })
  },
  //删除历史记录
  handleDelete(){
    wx.showModal({
      content:'确认删除吗？',
      success:()=>{
        this.setData({
          historyList:[]
        })
        wx.removeStorageSync('historyList')
      }
    })
  },
  //返回video页面
  toVideo(){
    wx.navigateBack({
      delta: 1,
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