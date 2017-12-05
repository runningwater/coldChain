// pages/index/myWayBill/myWayBill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      billList:[]
  },
  wayBill:function(e){
    
    // var bill = e.currentTarget.dataset.bill;//?bill='+JSON.stringify(bill)
    var oderId = e.currentTarget.dataset.oderid;
    var barcode = e.currentTarget.dataset.barcode;
    wx.navigateTo({
        url: 'wayBill/wayBill?oderId=' + oderId+'&barcode='+barcode,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var This = this;
        wx.getStorage({
          key: 'token',
          success: function(res) {
            wx.request({
              url: getApp().globalData.url + '/order/myOrder',
              method: "GET",             
              data:{
                token:res.data
              },
              success:function(msg){
               
                if (msg.data.success){     
                    if (msg.data.data.length==0){
                        getApp().hnToast("暂无数据")
                    }               
                    This.setData({
                        billList: msg.data.data
                    })
                }else{
                    getApp().hnToast(msg.data.message)
                }
               
              }
            })
          },
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