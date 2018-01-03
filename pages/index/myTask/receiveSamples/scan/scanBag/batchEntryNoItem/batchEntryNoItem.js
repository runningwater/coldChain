// pages/index/myTask/receiveSamples/scan/scanBag/batchEntryNoItem/batchEntryNoItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    bag: "",//标本袋
    bagid: "",//标本袋id
    hospitalId: "",//医院id
    recordid: "",//标本箱记录id
    transportid: "",//运输表id
    location: "",//经纬度
    bagNum: 0,
    code: "",
    barCode: [],
    startPoint: [0, 0],//初始化touchstart坐标
    flag: false,
    show: false,
    isitem: true,
    isExamine: false,//查看批次详情
    psnNum:0,//批次数量
    x:"",
    psnArr: [],//批次号数组
    singleCode: '',//单个条码
    startCode: "",//第一个条码
    endCode: "",//最后一个条码
    sampleId: "",//标本ID
    sampleList: [],//批次号下对应的标本列表
    sample: "",//点击批次号显示其下面的标本
    barcodeArr: [],
    psn: "",//当前录入生成的批次号
    photos: [],//申请单图片
    filePaths: [],//交接单
    lock: false
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
    var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    var startPoint = This.data.startPoint;
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
        l: e.currentTarget.dataset.barcode,
        flag: false
      })
    }
  },
  end1: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getSystemInfo({
      success: function (res) {
        var width = parseInt(res.screenWidth);
        //console.log(width)
        This.setData({
          x: (width - 32) / 4
        })
      },
    })
    wx.getLocation({
      success: function (res) {
        This.setData({
          location: res.longitude + "," + res.latitude
        })
      },
    })

    This.setData({
      bagid: options.bagid,
      hospitalId: options.hospitalId,
      recordid: options.recordid,
      bag: options.bag,
      transportid: options.transportid
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          })
          This.init();
          This.getPsn();
        }
      },
    })

  },
  getPsn: function () {
    var This = this;
    getApp().snGet("/batch/getBatchList", {
      token: This.data.token,
      bagId: This.data.bagid
    }, function (res) {
      This.setData({
        psnNum: res.data.data.length,
        psnArr: res.data.data
      })
    })
  },
  init: function () {
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/sample/getSample',
      data: {
        token: This.data.token,
        bagId: This.data.bagid,
        recordId: This.data.recordid,
        hospitalId: This.data.hospitalId
      },
      success: function (msg) {
        if (msg.data.data.length > 0) {
          This.setData({
            barCode: msg.data.data,
            bagNum: msg.data.data.length
          })

        } else {
          //getApp().hnToast("暂无数据")
        }

      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  showMsg: function (e) {
    var v = this.data.show;
    this.setData({
      show: !v
    })
  },
  showSampleList: function (e) {

    var This = this;
    getApp().snGet("/batch/getApply", {
      token: This.data.token,
      psn: e.currentTarget.dataset.psn
    }, function (res) {
      // console.log(res)
      This.setData({
        sampleList: res.data.data.appBatchCodeList,
        sample: e.currentTarget.dataset.psn
      })
    })
  },
  //确定生成连续条码
  startCode: function (e) {
    this.setData({
      startCode: e.detail.value
    });
  },
  endCode: function (e) {
    this.setData({
      endCode: e.detail.value
    });
  },
  //扫描第一个条码
  scanStartCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.setData({
          startCode: msg.result
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  //扫描最后一个条码
  scanEndCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.setData({
          endCode: msg.result
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  generateBarcode: function (e) {
    var This = this;
    //console.log(this.data.startCode)
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/batch/proBarCode',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: res.data,
              hospitalId: This.data.hospitalId,
              startCode: This.data.startCode,
              endCode: This.data.endCode
            },
            success: function (msg) {
              //console.log(msg)

              if(msg.data.success){
                var barcodeArr = This.data.barcodeArr;
                for (let i = 0; i < msg.data.data.length; i++) {
                  barcodeArr.push(msg.data.data[i])
                }
                This.setData({
                  barcodeArr: barcodeArr
                })
              }else{
                getApp().hnToast(msg.data.message)
              }
            }
          })
        }
      }
    })
  },
  // 单个录入
  scanCodeForBatch: function (e) {
    var This = this;
    this.setData({
      singleCode: e.detail.value,
    })
    var barcodeArr = this.data.barcodeArr;
    barcodeArr.push({ barCode: e.detail.value });

    this.setData({
      barcodeArr: barcodeArr
    })

  },
  //扫描单个条码
  scanSingleCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        this.setData({
          singleCode: msg.result,
        })
        var barcodeArr = This.data.barcodeArr;
        barcodeArr.push({ barCode: msg.result });
        console.log(barcodeArr);
        this.setData({
          barcodeArr: barcodeArr
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  deleteSample: function (e) {
    var This = this;
    var currentBarcode = e.currentTarget.dataset.barcode;

    wx.showModal({
      title: '确认删除？',
      content: '确定要移除此标本吗？',
      success: function (yes) {
        if (yes.confirm) {
          var arr = This.data.barcodeArr;
          for (var i = 0; i < arr.length; i++) {

            if (arr[i].barCode == currentBarcode) {
              arr.splice(i, 1);
            }
          }
          This.setData({
            barcodeArr: arr
          })
        }
      }
    })
  },
  //查看批次
  examineBatch:function(){
    var This = this;
    this.setData({
      isitem: false,
      isExamine: true,
    })
    wx.setNavigationBarTitle({
      title: '查看批次',
    })
  },
  modifyPhoto: function (e) {
    var This = this;
    this.setData({
      isExamine: false,
      psn: e.currentTarget.dataset.psn
    })
    getApp().snGet("/batch/getApply", {
      token: This.data.token,
      psn: e.currentTarget.dataset.psn
    }, function (res) {
      //console.log(res)
      This.setData({
        photos: res.data.data.appApplySampleList
      })
    });
    wx.setNavigationBarTitle({
      title: '上传申请单',
    })
  },
  examineEnd:function(){
    var This=this;
    this.setData({
      isitem:true,
      isExamine:false
    })
    wx.setNavigationBarTitle({
      title: '批量录入',
    })
  },
  //上传申请单
  confirminput:function(e){

    var This = this;
    if (This.data.barcodeArr.length <= 0) {
      wx.showModal({
        title: '请输入条码',
        content: '你没有输入条码',
      })
      return false;
    }

    var barCodeStr = "";
    for (let i = 0; i < This.data.barcodeArr.length; i++) {
      barCodeStr += This.data.barcodeArr[i].barCode + ",";
    }
    barCodeStr = barCodeStr.substr(0, barCodeStr.length - 1);
 
  
    var data = {
      token: This.data.token,
      bagId: This.data.bagid,
      recordId: This.data.recordid,
      hospitalId: This.data.hospitalId,
      barCodeStr: barCodeStr,
      location: This.data.location,
      transportId: This.data.transportid
    }
    getApp().snPost("/batch/postSamples", data, function (res) {
      //console.log(res.data.data.psn)
        if(res.data.success){
          This.setData({
            psn: res.data.data.psn,
            isitem: false,
            isExamine: false
          })
        
          getApp().snGet("/batch/getApply", {
            token: This.data.token,
            psn: res.data.data.psn
          }, function (res) {
            // console.log(res.data.data.appApplySampleList)
            This.setData({
              photos: res.data.data.appApplySampleList
            })
          });
        }else{
          getApp().hnToast(res.data.message)
        }
    })

  
    wx.setNavigationBarTitle({
      title: '上传申请单',
    })
    
   
  },
  takePhoto: function (e) {
    var That = this;
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {

        That.setData({
          filePaths: res.tempFilePaths
        })
        //console.log(That.data.filePaths)
        for (var i = 0; i < That.data.filePaths.length; i++) {
          wx.uploadFile({
            url: getApp().globalData.url + '/batch/uploadApply',
            filePath: That.data.filePaths[i],
            name: 'pic' + i,
            formData: {
              token: That.data.token,
              psn: That.data.psn
            },
            success: function (msg) {

              var data = JSON.parse(msg.data);
              if (data.success) {
                wx.showToast({
                  title: '交接单上传成功',
                })
                //console.log(That.data.filePaths)
                getApp().snGet("/batch/getApply", {
                  token: That.data.token,
                  psn: That.data.psn
                }, function (res) {
                  //console.log(res.data.data.appApplySampleList)
                  That.setData({
                    photos: res.data.data.appApplySampleList
                  })
                });
              } else {
                wx.showToast({
                  title: '交接单上传失败',
                })
              }
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }
      },
    })

  },
  //预览图片
  prePic: function (e) {
    if (this.data.lock) {
      return false;
    }
    //console.log(e.currentTarget.dataset.file);
    var picArr = e.currentTarget.dataset.file;
    var current = e.currentTarget.dataset.current;
    var urls = [];
    for (var i = 0; i < picArr.length; i++) {
      urls.push(picArr[i].url)
    }
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  delSampleApply: function (e) {
    var This = this;
    This.setData({
      lock: true//加锁
    })
    var attachId = e.currentTarget.dataset.attachid;
    wx.showModal({
      title: '删除申请单',
      content: '确认要删除此张申请单图片么？',
      success: function (confirm) {
        if (confirm.confirm) {
          wx.request({
            url: getApp().globalData.url + '/batch/deleteApply',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              attachId: attachId,
              psn: This.data.psn
            },
            success: function (msg) {

              if (msg.data.success) {
                wx.showToast({
                  title: '删除成功',
                })
                getApp().snGet("/batch/getApply", {
                  token: This.data.token,
                  psn: This.data.psn
                }, function (res) {

                  This.setData({
                    photos: res.data.data.appApplySampleList
                  })
                });
              } else {
                wx.showToast({
                  title: '删除失败',
                })
              }
            }
          })
        }
      }
    })
  },
  finish:function(){
    this.getPsn();
    this.setData({
      isitem: true,
      isExamine: false,
      barcodeArr: [],
      psn: ""
    })
    wx.setNavigationBarTitle({
      title: '查看批次',
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