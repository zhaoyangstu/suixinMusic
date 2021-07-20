// 发送ajax请求
export default (url,data={},method="GET")=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: 'http://localhost:3000'+url,
      // http://wymusic.free.idcfengye.com
      // http://localhost:3000
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!=-1):''
      },//设置cookie信息
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}