// 发送ajax请求
export default (url,data={},method="GET")=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: 'http://wymusic.free.idcfengye.com'+url,
      data,
      method,
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}