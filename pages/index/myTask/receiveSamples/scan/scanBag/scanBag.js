// pages/index/myTask/receiveSamples/scan/scanBag/scanBag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    token: "",
    samplesum: "",//含有几个标本袋
    barcode: "",//标本箱条码
    hospitalId: "",
    boxid: "",
    recordid: "",
    transportid: "",
    barCode: [],
    startPoint: [0, 0],//初始化touchstart坐标
    flag: false
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
  delBag:function(e){
    var This = this;
    var bagId = e.currentTarget.dataset.bagid;
  
      wx.showModal({
        title: '确认删除？',
        content: '确定要移除此标本袋吗？',
        success: function (confirm) {
          if (confirm.confirm) {
            wx.request({
              url: getApp().globalData.url + '/sample/removeSampleBag',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                token: This.data.token,
                bagId: bagId
              },
              success: function (msg) {

                if (msg.data.success) {
                  wx.showToast({
                    title: msg.data.message,
                  })

                  wx.request({
                    url: getApp().globalData.url + '/sample/getSampleBag',
                    data: {
                      token: This.data.token,
                      boxId: This.data.boxid,
                      recordId: This.data.recordid,
                      hospitalId: This.data.hospitalId
                    },
                    success: function (msg) {
                      // console.log(msg)
                      if (msg.data.success) {
                        This.setData({
                          barCode: msg.data.data,
                          samplesum: msg.data.data.length
                        })
                      } else {
                        wx.showToast({
                          title: msg.data.message,
                        })
                      }

                    },
                    fail: function (err) {
                      console.log(err)
                      wx.showToast({
                        title: '获取数据失败',
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '删除失败',
                  })
                }
              },
              fail: function (err) {
                wx.showToast({
                  title: '删除失败',
                })
              }
            })

          }
        }
      })
    

  },
  //扫描标本袋
  scanCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        //console.log(msg)
        var barcode = msg.result;
        wx.getStorage({
          key: 'token',
          success: function (res) {
            if (res.data) {
              This.setData({
                token: res.data
              });
              wx.request({
                url: getApp().globalData.url + '/sample/scanSampleBag',
                method: "POST",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  token: This.data.token,
                  boxId: This.data.boxid,
                  recordId: This.data.recordid,
                  hospitalId: This.data.hospitalId,
                  //scanTime: scanTime,
                  barCode: barcode,
                  transportId: This.data.transportid
                },
                success: function (msg) {
                  if (msg.data.success) {
                    // console.log(msg.data)
                    wx.getStorage({
                      key: 'token',
                      success: function (res) {
                        if (res.data) {
                          This.setData({
                            token: res.data
                          });
                          wx.request({
                            url: getApp().globalData.url + '/sample/getSampleBag',
                            data: {
                              token: This.data.token,
                              boxId: This.data.boxid,
                              recordId: This.data.recordid,
                              hospitalId: This.data.hospitalId
                            },
                            success: function (msg) {
                              // console.log(msg)
                              if (msg.data.success) {
                                This.setData({
                                  barCode: msg.data.data,
                                  samplesum: msg.data.data.length
                                })
                              } else {
                                wx.showToast({
                                  title: msg.data.message,
                                })
                              }

                            },
                            fail: function (err) {
                              console.log(err)
                              wx.showToast({
                                title: '获取数据失败',
                              })
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
          },
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  //输入标本袋
  scanBag: function (e) {
    var This = this;
    var barcode = e.detail.value;
    var scanTime = getApp().getTime();//扫描时间
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          });
          wx.request({
            url: getApp().globalData.url + '/sample/scanSampleBag',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              boxId: This.data.boxid,
              recordId: This.data.recordid,
              hospitalId: This.data.hospitalId,
              //scanTime: scanTime,
              barCode: barcode,
              transportId: This.data.transportid
            },
            success: function (msg) {
              if (msg.data.success) {
                // console.log(msg.data)
                wx.getStorage({
                  key: 'token',
                  success: function (res) {
                    if (res.data) {
                      This.setData({
                        token: res.data
                      });
                      wx.request({
                        url: getApp().globalData.url + '/sample/getSampleBag',
                        data: {
                          token: This.data.token,
                          boxId: This.data.boxid,
                          recordId: This.data.recordid,
                          hospitalId: This.data.hospitalId
                        },
                        success: function (msg) {
                          // console.log(msg)
                          if (msg.data.success) {
                            This.setData({
                              barCode: msg.data.data,
                              samplesum: msg.data.data.length
                            })
                          } else {
                            wx.showToast({
                              title: msg.data.message,
                            })
                          }

                        },
                        fail: function (err) {
                          console.log(err)
                          wx.showToast({
                            title: '获取数据失败',
                          })
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
      },
    })
  },
  samples1: function (e) {
    // console.log(e);
    var This = this;
    var bagid = e.currentTarget.dataset.id;
    var recordid = e.currentTarget.dataset.recordid;
    var hospitalId = this.data.hospitalId;
    var bag = e.currentTarget.dataset.bag;
    var batch = "";
    wx.getStorage({
      key: 'isBatch',
      success: function(res) {
        batch = res.data;
      },
    })
    wx.getStorage({
      key: 'isApplyItem',
      success: function(res) {
        console.log(batch)
        if (res.data=="1"){
          wx.navigateTo({
            url: 'samplesForItem/samplesForItem?bagid=' + bagid + "&recordid=" + recordid
            + "&hospitalId=" + hospitalId + "&bag=" + bag + "&transportid=" + This.data.transportid,
          })
        }else{
          wx.navigateTo({
            url: 'samples/samples?bagid=' + bagid + "&recordid=" + recordid
            + "&hospitalId=" + hospitalId + "&bag=" + bag + "&transportid=" + This.data.transportid,
          })
        }
      },
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
    console.log(options)
    var This = this;
    this.setData({
      barcode: options.barcode,
      boxid: options.boxid,
      recordid: options.recordid,
      transportid: options.transportid,
      samplesum: options.samplesum,
      hospitalId: options.hospitalId
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          });
          wx.request({
            url: getApp().globalData.url + '/sample/getSampleBag',
            data: {
              token: This.data.token,
              boxId: This.data.boxid,
              recordId: This.data.recordid,
              hospitalId: This.data.hospitalId
            },
            success: function (msg) {
              // console.log(msg)
              if (msg.data.success) {
                This.setData({
                  barCode: msg.data.data,
                  samplesum: msg.data.data.length
                })
              } else {
                wx.showToast({
                  title: msg.data.message,
                })
              }

            },
            fail: function (err) {
              console.log(err)
              wx.showToast({
                title: '获取数据失败',
              })
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
    var options = {
      barcode: this.data.barcode,
      boxid: this.data.boxid,
      recordid: this.data.recordid,
      transportid: this.data.transportid,
      samplesum: this.data.samplesum,
      hospitalId: this.data.hospitalId
    };
    this.onLoad(options)
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