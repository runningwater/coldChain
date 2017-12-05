// pages/index/sampleBox/getBox/getBox.js
Page({

  /**
   * 页面的初始数据
   * 1
   *
   */
  data: {
    token:"",
    code: "",
    startPoint: [],//初始化touchstart坐标
    longitude: "",
    latitude: "",
    barCode: [],
    flag: false,
    l:''
  },
  cancel:function(){
    this.setData({
      l:""
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
        l: e.currentTarget.dataset.id,
        flag: false
      })
    }
  },
  
  scanCode: function () {
      var This = this;
    wx.scanCode({
      success: function (msg) {
        //console.log(msg.result)
        wx.getStorage({
          key: 'token',
          success: function (res) {
            if (res.data) {
              wx.request({
                url: getApp().globalData.url + '/box/applyBox',
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  token: res.data,
                  barCode: msg.result,
                  location: This.data.longitude + "," + This.data.latitude
                }, 
                success: function (msg) {
                  
                  if (msg.data.success) {
                    wx.getStorage({
                      key: 'token',
                      success: function (res) {
                        if (res.data) {
                          wx.request({
                            url: getApp().globalData.url + '/box/applyInitBox',
                            data: {
                              token: res.data
                            },
                            success: function (msg) {

                              if (msg.data.success) {

                                This.setData({
                                  barCode: msg.data.data

                                });
                              } else {
                                wx.showModal({
                                  title: '获取标本箱信息失败',
                                  content: '未能获取标本箱信息',
                                })
                              }
                            }
                          })
                        }
                      },
                    })
                  } else {
                   getApp().hnToast()
                  }
                },
                fail: function (msg) {
                  console.log(msg)
                }
              })
            }
          },
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
    delBox:function(e){
      var This = this;
     
        wx.showModal({
          title: '移除标本箱',
          content: '确定要移除此标本箱么？',
          success: function (confirm) {
            if (confirm.confirm) {
              wx.request({
                url: getApp().globalData.url + '/box/removeBox',
                method: "POST",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  token: This.data.token,
                  transportId: e.currentTarget.dataset.transportid
                },
                success: function (msg) {
               
                  if (msg.data.success) {
                    wx.showToast({
                      title: '移除成功',
                    })

                    wx.getStorage({
                      key: 'token',
                      success: function (res) {

                        if (res.data) {

                          wx.request({
                            url: getApp().globalData.url + '/box/applyInitBox',
                            data: {
                              token: res.data
                            },
                            success: function (msg) {
                              //console.log(msg);
                              if (msg.data.success) {

                                This.setData({
                                  barCode: msg.data.data

                                });
                              } else {
                                wx.showModal({
                                  title: '获取标本箱信息失败',
                                  content: '未能获取标本箱信息',
                                })
                              }
                            }
                          })
                        }
                      },
                    })
                  } else {
                    wx.showToast({
                      title: msg.data.message,
                    })
                  }
                }
              })
            }
          }
        })
      
    },


  //输入条码
  barCodeScan: function (e) {

    var This = this;
    This.setData({
      code: e.detail.value
    });

    wx.getStorage({
      key: 'token',
      success: function (res) {

        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/box/applyBox',
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: res.data,
              barCode: This.data.code,
              location: This.data.longitude + "," + This.data.latitude
            }, success: function (msg) {

              if (msg.data.success) {

                wx.getStorage({
                  key: 'token',
                  success: function (res) {

                    if (res.data) {

                      wx.request({
                        url: getApp().globalData.url + '/box/applyInitBox',
                        data: {
                          token: res.data
                        },
                        success: function (msg) {

                          if (msg.data.success) {

                            This.setData({
                              barCode: msg.data.data

                            });
                          } else {
                            wx.showModal({
                              title: '获取标本箱信息失败',
                              content: '未能获取标本箱信息',
                            })
                          }
                        }
                      })
                    }
                  },
                })
              } else {
                wx.showToast({
                  title: msg.data.message,
                })
              }
            },
            fail: function (msg) {
              console.log(msg)
            }
          })
        }
      },
    })
  },
  //绑定设备
  bindDevice: function (e) {
    //console.log(e.target.dataset);
    wx.navigateTo({
      url: 'bindDevice/bindDevice?transportid=' + e.target.dataset.transportid
    })
  },

  complete: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getLocation({
      success: function (res) {

        This.setData({
          longitude: res.longitude + "," + res.latitude

        })

      },
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
     
        if (res.data) {
          This.setData({
            token:res.data
          })
          wx.request({
            url: getApp().globalData.url + '/box/applyInitBox',
            data: {
              token: res.data
            },
            success: function (msg) {
             
              if (msg.data.success) {

                This.setData({
                  barCode: msg.data.data

                });
              } else {
                wx.showModal({
                  title: '获取标本箱信息失败',
                  content: '未能获取标本箱信息',
                })
              }
            }
          })
        }
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
      wx.getStorage({
          key: 'token',
          success: function (res) {
            
              if (res.data) {

                  wx.request({
                      url: getApp().globalData.url + '/box/applyInitBox',
                      data: {
                          token: res.data
                      },
                      success: function (msg) {
                        
                          if (msg.data.success) {

                              This.setData({
                                  barCode: msg.data.data

                              });
                          } else {
                              wx.showModal({
                                  title: '获取标本箱信息失败',
                                  content: '未能获取标本箱信息',
                              })
                          }
                      }
                  })
              }
          },
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