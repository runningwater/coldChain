// pages/index/myTask/receiveSamples/scan/scanBag/batchEntry/batchEntry.js
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
    show:false,
    isitem: true,
    isExamine:false,//查看批次详情
    itemAndPhoto: false,//录项目 拍照容器
    applyItems: [],//项目列表
    sampleId: "",//标本ID
    applyItemId: [],//项目id
    singleCode:'',//单个条码
    startCode:"",//第一个条码
    endCode:"",//最后一个条码
    barcodeArr:[],
    psnNum:0,//批次号个数
    psnArr:[],//批次号数组
    psn:"",//当前录入生成的批次号
    filePaths:[],//交接单
    sampleList:[],//批次号下对应的标本列表
    sample:"",//点击批次号显示其下面的标本
  },
  cancel: function () {
    // this.setData({
    //   l: ""
    // })
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
        l: e.currentTarget.dataset.sampleid,
        flag: false
      })
    }

  },
  delSample: function (e) {
    var This = this;

    var sampleId = e.currentTarget.dataset.sampleid;
    wx.showModal({
      title: '确认删除？',
      content: '确定要移除此标本吗？',
      success: function (confirm) {
        if (confirm.confirm) {
          wx.request({
            url: getApp().globalData.url + '/sample/removeSample',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              sampleId: sampleId
            },
            success: function (msg) {
              if (msg.data.success) {
                wx.showToast({
                  title: msg.data.message,
                })

                wx.request({
                  url: getApp().globalData.url + '/sample/getSample',
                  data: {
                    token: This.data.token,
                    bagId: This.data.bagid,
                    recordId: This.data.recordid,
                    hospitalId: This.data.hospitalId
                  },
                  success: function (msg) {
                    //console.log(msg)
                    This.setData({
                      barCode: msg.data.data,
                      bagNum: msg.data.data.length
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                  }
                })
              }
            }
          })

        }
      }
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
              psn:That.data.psn
            },
            success: function (msg) {

              var data = JSON.parse(msg.data);
              if (data.success) {
                wx.showToast({
                  title: '交接单上传成功',
                })
                console.log(That.data.filePaths)
                getApp().snGet("/batch/getApply",{
                    token: That.data.token,
                    psn: That.data.psn
                },function(res){
                  console.log(res)
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
  
 
  
  //完成
  complete: function () {

    wx.navigateBack({
      delta: 1
    })

  },
  // 单个录入
  scanCodeForBatch:function(e){
    var This = this;
    this.setData({
      singleCode:e.detail.value,
    })
    var barcodeArr=this.data.barcodeArr;
    barcodeArr.push({oder:"9", barCode: e.detail.value});
    console.log(barcodeArr);
    this.setData({
      barcodeArr:barcodeArr
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

    wx.getStorage({
      key: 'item',
      success: function (res) {
        console.log(res)
        This.setData({
          applyItems: res.data
        })

      },
    })

  },
  getPsn:function(){
    var This = this;
    getApp().snGet("/batch/getBatchList",{
      token:This.data.token,
      bagId:This.data.bagid
    },function(res){     
      This.setData({
        psnNum:res.data.data.length,
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
  search: function (e) {
    var This = this;

    wx.getStorage({
      key: 'item',
      success: function (res) {
        if (e.detail.value == "") {
          This.setData({
            applyItems: res.data
          })
          return;
        }

        var arr = [];
        for (let i in res.data) {
          //console.log(this.data.hosList[i])
          res.data[i].show = false;

          if (res.data[i].search.indexOf(e.detail.value) >= 0) {

            res.data[i].show = true;
            arr.push(res.data[i])
          }
        }
        if (arr.length == 0) {
          This.setData({
            applyItems: [{ show: true, applyItemName: '无相关数据' }]
          })
        } else {
          This.setData({
            applyItems: arr
          })
        }

      },
    })
  },
  selectApplyItems: function (e) {
    //console.log(e.detail.value)
    this.setData({
      applyItemId: e.detail.value
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
  generateBarcode:function(e){
    var This=this;
    console.log(this.data.startCode)
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
              startCode:This.data.startCode,
              endCode: This.data.endCode
            },
            success:function(msg){
              console.log(msg)
              var barcodeArr = This.data.barcodeArr;
              for (let i = 0; i < msg.data.data.length;i++){
                barcodeArr.push(msg.data.data[i])
              }
              This.setData({
                barcodeArr: barcodeArr
              })   
            }
          })
        }
      }
    })
  },
  // 确认批次录入（下一步）
  confirmBatch: function (e) {
    var This = this;
    if (This.data.barcodeArr.length<=0){
      wx.showModal({
        title: '请输入条码',
        content: '你没有输入条码',
      })
      return false;
    }
   
    var barCodeStr = "";
    for(let i=0;i<This.data.barcodeArr.length;i++){
      barCodeStr += This.data.barcodeArr[i].barCode+",";
    }
    barCodeStr = barCodeStr.substr(0,barCodeStr.length-1);
        This.setData({
          isitem: false,
          itemAndPhoto:true,
          isExamine:false
        });
        wx.setNavigationBarTitle({
          title: '录入项目',
        })
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
          console.log(res.data.data.psn)
          This.setData({
            psn: res.data.data.psn
          })
        })
      
  },
 
  //查看批次详情
  examineBatch:function(){
    var This =this;
    this.setData({
      isitem: false,
      isExamine:true,
      itemAndPhoto: false
    })
    wx.setNavigationBarTitle({
      title: '查看批次',
    })
  
  },
  showMsg: function (e) {
    var v=this.data.show;
    this.setData({
      show:!v
    })
  },
  showSampleList:function(e){
   
    var This = this;
    getApp().snGet("/batch/getApply",{
      token:This.data.token,
      psn: e.currentTarget.dataset.psn
    },function(res){
      console.log(res)
      This.setData({
        sampleList: res.data.data.appBatchCodeList,
        sample: e.currentTarget.dataset.psn
      })
    })
  },
  examineEnd:function(){
    this.setData({
      isExamine: false,
      isitem:true,
      itemAndPhoto: false
    })
    wx.setNavigationBarTitle({
      title: '批量录入',
    })
  },
  
  confirminput: function () {
    var This = this;
    if (This.data.applyItemId.length<=0){
      wx.showModal({
        title: '请选择项目',
        content: '项目不能为空，请选择项目',
      })
      return false;
    }
      This.setData({
        itemAndPhoto: false,
        isExamine:false
      });
      wx.setNavigationBarTitle({
        title: '上传申请单',
      })
      getApp().snPost("/batch/itemInput",{
        token:This.data.token,
        psn:This.data.psn,
        itemStr: This.data.applyItemId
      },function(res){
        console.log(res)
        if(res.data.success){
          getApp().hnToast("录入成功")
        }else{
          getApp().hnToast(res.data.message);
          return false;
        }
      })
      
  },
  complate: function () {
    this.setData({
      isitem: true,
      itemAndPhoto: true,
      barcodeArr:[],
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