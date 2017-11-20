// pages/index/samplePacking/samplePacking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: [],//存放选中的标本箱条码
    code: "",
    barcodeArr: [],//存放条码
    barCode: [],
    token: "",
    location: "",//经纬度
    startPoint: [0, 0],//初始化touchstart坐标
    flag: false,
    l:""
  },
  cancel: function () {
    this.setData({
      l: ""
    })
  },
  mytouchstart: function (e) {
    //开始触摸，获取触摸点坐标并放入数组中
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY],
      flag: false
    });
  },
  //触摸点移动 
  mymove: function (e) {
    var transportId = e.currentTarget.dataset.transportid;
    var This = this;

    //当前触摸点坐标
    var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    var startPoint = this.data.startPoint;
    //比较pageX值
    if (curPoint[0] <= startPoint[0]) {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        //左滑 
        This.setData({
          flag: true
        })

      }
    }

  },
  myend: function (e) {
    var This = this;
    if (This.data.flag) {
      This.setData({
        l: e.currentTarget.dataset.transportid,
        flag: false
      })
    }
  },
  delBox:function(e){
    var This = this;
    
      wx.showModal({
        title: '确认删除？',
        content: '确定要删除此箱子吗？',
        success: function (confirm) {
          if (confirm.confirm) {
            wx.request({
              url: getApp().globalData.url + '/box/removeTransportBox',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                token: This.data.token,
                transportId: e.currentTarget.dataset.transportid
              },
              success: function (msg) {
                //   console.log(msg)
                if (msg.data.success) {
                  wx.request({
                    url: getApp().globalData.url + '/box/getTransportBoxList',
                    data: {
                      token: This.data.token
                    },
                    success: function (msg) {
                      //console.log(msg)
                      This.setData({
                        barCode: msg.data.data
                      })
                    }
                  })
                } else {
                  getApp().hnToast(msg.data.message)
                }
              },
              fail: function (e) {

              }
            })

          }
        }
      })
  },
  waybill: function () {
    var boxCode = "";
    for (var i = 0; i < this.data.select.length; i++) {
      boxCode += this.data.select[i] + ",";
    }
    boxCode = boxCode.substring(0, boxCode.length - 1);
    wx.navigateTo({
      url: 'waybill/waybill?boxCode=' + boxCode,
    })
  },
  scanCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {

        var barcode = msg.result;
        wx.request({
          url: getApp().globalData.url + '/box/applyTransportBox',
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
              wx.request({
                url: getApp().globalData.url + '/box/getTransportBoxList',
                data: {
                  token: This.data.token
                },
                success: function (vv) {
                  This.setData({
                    barCode: vv.data.data
                  })
                }
              })
            } else {
              if (msg.data.code == "1") {
                wx.showModal({
                  title: '确定作为运输箱？',
                  content: '此箱子是标本箱，确定要作为运输箱使用么？',
                  success: function (confirm) {
                    if (confirm.confirm) {
                      wx.request({
                        url: getApp().globalData.url + '/box/confirmTransportBox',
                        method: "POST",
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
                          token: This.data.token,
                          barCode: barcode,
                          location: This.data.location
                        },
                        success: function (ms) {
                          if (ms.data.success) {
                            wx.request({
                              url: getApp().globalData.url + '/box/getTransportBoxList',
                              data: {
                                token: This.data.token
                              },
                              success: function (vv) {
                                This.setData({
                                  barCode: vv.data.data
                                })
                              }
                            })
                          } else {
                            getApp().hnToast(ms.data.message);
                          }

                        }
                      })
                    } else {
                      getApp().hnToast("您取消了操作");
                    }
                  }
                })
              } else {
                getApp().hnToast(msg.data.message);
              }

            }
          }
        })
      }
    })
  },
  //扫描新箱子 输入操作
  scanNewBox: function (e) {
    var This = this;
    var barcode = e.detail.value;
    wx.request({
      url: getApp().globalData.url + '/box/applyTransportBox',
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
          wx.request({
            url: getApp().globalData.url + '/box/getTransportBoxList',
            data: {
              token: This.data.token
            },
            success: function (vv) {
              This.setData({
                barCode: vv.data.data
              })
            }
          })
        } else {
          if (msg.data.code == "1") {
            wx.showModal({
              title: '确定作为运输箱？',
              content: '此箱子是标本箱，确定要作为运输箱使用么？',
              success: function (confirm) {
                if (confirm.confirm) {
                  wx.request({
                    url: getApp().globalData.url + '/box/confirmTransportBox',
                    method: "POST",
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                      token: This.data.token,
                      barCode: barcode,
                      location: This.data.location
                    },
                    success: function (ms) {
                      if (ms.data.success) {
                        wx.request({
                          url: getApp().globalData.url + '/box/getTransportBoxList',
                          data: {
                            token: This.data.token
                          },
                          success: function (vv) {
                            This.setData({
                              barCode: vv.data.data
                            })
                          }
                        })
                      } else {
                        getApp().hnToast(ms.data.message);
                      }

                    }
                  })
                } else {
                  getApp().hnToast("您取消了操作");
                }
              }
            })
          } else {
            getApp().hnToast(msg.data.message);
          }

        }
      }
    })

  },
  //绑定设备
  bindDevice: function (e) {
    //console.log(e.currentTarget.dataset.transportid)
    wx.navigateTo({
      url: 'bindDevice/bindDevice?transportid=' + e.currentTarget.dataset.transportid,
    })
  },
  //扫描标本袋 点击标本箱列表进入
  scanBag: function (e) {
    //console.log(e.currentTarget.dataset.transportid)
    wx.navigateTo({
      url: 'scanBag/scanBag?transportid=' + e.currentTarget.dataset.transportid,
    })
  },
  checkboxChange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      select: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      select: []
    })
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          })
          //初始化标本箱列表
          wx.request({
            url: getApp().globalData.url + '/box/getTransportBoxList',
            data: {
              token: This.data.token
            },
            success: function (msg) {
              //console.log(msg)
              This.setData({
                barCode: msg.data.data
              })
            }
          })
        }
      },
    })
    wx.getLocation({
      success: function (res) {
        This.setData({
          location: res.longitude + "," + res.latitude
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
    var This = this;
    // wx.request({
    //     url: getApp().globalData.url + '/box/getTransportBoxList',
    //     data: {
    //         token: This.data.token
    //     },
    //     success: function (msg) {
    //         console.log(msg)
    //         This.setData({
    //             barCode: msg.data.data
    //         })
    //     }
    // })
    This.onLoad();
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
      url: getApp().globalData.url + '/box/getTransportBoxList',
      data: {
        token: This.data.token
      },
      success: function (msg) {
        //console.log(msg)
        This.setData({
          barCode: msg.data.data
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
    // console.log("分享")
  }
})