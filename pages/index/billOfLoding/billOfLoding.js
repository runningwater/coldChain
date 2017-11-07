// pages/index/billOfLoding/billOfLoding.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: "",
        location:"",
        orderList2: [],//已提货
        orderList1: [] ,//未提货
        flag1:true,
        flag2:false
    },
    already: function () {
        this.setData({
            flag1: false,
            flag2: true
        })
     },
    didnot:function(){
        this.setData({
            flag1: true,
            flag2: false
        })
    },
    wayBill: function (e) {
      //  console.log(e.currentTarget.dataset.bill)
        var bill = e.currentTarget.dataset.bill;
        wx.navigateTo({
            url: 'waybill/waybill?bill='+JSON.stringify(bill),
        })
    },
    //司机提货动作
    receive:function(e){
       var This =  this;
        var barcode = e.target.dataset.barcode;
        wx.showModal({
            title: '确定提货？',
            content: '请确认物品完好后，接收',
            success:function(confirm){
                if(confirm.confirm){
                    wx.request({
                        url: getApp().globalData.url + '/box/driverBox',
                        method: "POST",
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            token: This.data.token,
                            barCode: barcode,
                            location: This.data.location
                        },
                        success: function (msg) {
                           
                            if (msg.data.success) {
                                getApp().hnToast(msg.data.message);
                                wx.request({
                                    url: getApp().globalData.url + '/box/getTakeBox',
                                    method: "POST",
                                    header: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    data: {
                                        token: This.data.token
                                    },
                                    success: function (msg) {
                                     
                                        var arr1 = [];//临时数组 
                                        var arr2 = [];//已接收
                                        for (var i = 0; i < msg.data.data.length; i++) {
                                            if (msg.data.data[i].isDriverReceive == "-1") {
                                                arr1.push(msg.data.data[i])
                                            } else {
                                                arr2.push(msg.data.data[i])
                                            }
                                        }
                                        This.setData({
                                            orderList1: arr1,
                                            orderList2: arr2
                                        })
                                    }
                                })
                            } else {
                                getApp().hnToast(msg.data.message);
                            }
                        }
                    })
                }else{
                    getApp().hnToast("您取消了操作");
                }
            }
        })
    
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var This = this;
        wx.getLocation({
            success: function(res) {
                This.setData({
                    location: res.longitude + "," + res.latitude
                })
            },
        })
        wx.getStorage({
            key: 'token',
            success: function (res) {
                if (res.data) {
                    This.setData({
                        token: res.data
                    });
                }
                wx.request({
                    url: getApp().globalData.url + '/box/getTakeBox',
                    method: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        token: This.data.token
                    },
                    success: function (msg) {
                      if(msg.data.data.length!=0){
                       
                        var arr1 = [];//临时数组 
                        var arr2 = [];//已接收
                        for (var i = 0; i < msg.data.data.length; i++) {
                          if (msg.data.data[i].isDriverReceive == "-1") {
                            arr1.push(msg.data.data[i])
                          } else {
                            arr2.push(msg.data.data[i])
                          }
                        }
                        This.setData({
                          orderList1: arr1,
                          orderList2: arr2
                        })
                      }else{
                        getApp().hnToast("暂无数据")
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
      var This = this;
      wx.request({
        url: getApp().globalData.url + '/box/getTakeBox',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          token: This.data.token
        },
        success: function (msg) {

          var arr1 = [];//临时数组 
          var arr2 = [];//已接收
          for (var i = 0; i < msg.data.data.length; i++) {
            if (msg.data.data[i].isDriverReceive == "-1") {
              arr1.push(msg.data.data[i])
            } else {
              arr2.push(msg.data.data[i])
            }
          }
          This.setData({
            orderList1: arr1,
            orderList2: arr2
          })
        }
      })
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