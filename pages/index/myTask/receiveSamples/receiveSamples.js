// pages/index/myTask/receiveSamples/receiveSamples.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      token:"",
      hosName:"",//医院名称
      hospitalId:"",//医院id
      workId:"",//业务员id
      latitude:"",//纬度
      longitude:""//经度
  },
  //申请标本
  applySamples:function(){
    wx.navigateTo({
      url: 'scan/scan?hospitalId=' + this.data.hospitalId + 
      "&workId=" +this.data.workId,
    })
  },
  //扫描交接单
  scanReceipt:function(){
    wx.navigateTo({
      url: 'tackPic/tackPic?hospitalId=' + this.data.hospitalId +
      "&workId=" + this.data.workId,
    })
  },
  //离开医院
  leaveHospital:function(){
    var This = this;
   
    var leaveHosDate =  getApp().getTime();
    wx.getLocation({
      success: function(res) {
       This.setData({
         latitude: res.latitude,
         longitude: res.longitude
       })
       wx.request({
         url: getApp().globalData.url + '/task/leaveHospital',
         method: "POST",
         header: {
           "Content-Type": "application/x-www-form-urlencoded"
         },
         data: {
           token: This.data.token,
           workId: This.data.workId,
          // leaveHosDate: leaveHosDate,
           location: This.data.longitude + "," + This.data.latitude
         },
         success: function (msg) {
         
           if (msg.data.success){
             wx.navigateBack({
               delta:1
             })
           }else{
             wx.showToast({
               title: msg.data.message,
             })
           }
          
         }
       })
      },
    })
 
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This =this;
   wx.getStorage({
     key: 'token',
     success: function(res) {
      
       if(res.data){
         This.setData({
           token:res.data
         })
       }
     },
   })
    this.setData({
      hosName: options.hosName,
      hospitalId: options.hospitalId,
      workId: options.workId
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