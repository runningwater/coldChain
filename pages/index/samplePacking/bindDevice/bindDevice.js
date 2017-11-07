// pages/index/sampleBox/bindDevice/bindDevice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceBarcode: "",
    transportid: ""
  },
  //扫描设备条码
  scanCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.setData({
          deviceBarcode: msg.result
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '没有此条码，请核对',
        })
      }
    })
  },
  //输入设备条码
  codeValue: function (e) {
    this.setData({
      deviceBarcode: e.detail.value
    })
  },
  //输入设备号
  barCodeScan: function (e) {
    // console.log(e);
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/box/bindDevice',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: res.data,
              deviceBarCode: This.data.deviceBarcode,
              transportId: This.data.transportid
            },
            success: function (msg) {
             
              if (msg.data.success) {
                wx.showToast({
                  title: msg.data.message,
                })
                wx.navigateBack({
                    delta:1
                })
              } else {
                wx.showToast({
                  title: msg.data.message,
                })
              }


            }
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      transportid: options.transportid
    });
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