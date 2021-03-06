// pages/index/specimensSplit/specimensSplit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:"",
        location:"",
        code:"",    
        barcode:""//标本箱条码
    },
  
     //扫码
    scanCode: function () {
        var This = this;
        wx.scanCode({
            success: function (msg) {
                //console.log(msg.result)
                This.setData({
                  barcode:msg.result
                })
                This.scanSpecimens(msg.result)
            },
            fail: function (e) {
                //console.log(e);
                wx.showToast({
                    title: '扫码失败',
                })
            }
        })
    },
    //手动录入
    blurBox: function (e) {
        //console.log(e.detail.value)
        var barcode = e.detail.value;
        var This = this;
        This.setData({
          barcode: barcode
        })
        This.scanSpecimens(barcode)
       
    },
    scanSpecimens:function(barcode){
        var This = this;
        wx.request({
            url: getApp().globalData.url + '/box/openBox',
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                token: This.data.token,
                location: This.data.location,
                barCode: barcode
            },
            success: function (msg) {
                console.log(msg)
                if (msg.data.success) {    
                  if (msg.data.data.length==0){
                    getApp().hnToast("暂无数据")
                  }else{
                    wx.setStorage({
                      key: 'data',
                      data: msg.data.data,
                    })
                    wx.navigateTo({
                      url: 'splitSpecimen/splitSpecimen?barcode=' + barcode
                    })
                  }              
               
           
                } else {
                    getApp().hnToast(msg.data.message);
                }
            }
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
                This.setData({
                    token:res.data
                })
            },
        })
        wx.getLocation({
            success: function(res) {
                This.setData({
                    location: res.longitude + "," + res.latitude
                })
                wx.setStorage({
                  key: 'location',
                  data: res.longitude + "," + res.latitude,
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
        this.setData({
            code:""
        })
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