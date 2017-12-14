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
    itemStr:"",//已录项目
    photos:[],//申请单图片
    x:"",
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
  //扫描第一个条码
  scanStartCode:function(){
    var This=this;
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
  //扫描单个条码
  scanSingleCode:function(){
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.setData({
          singleCode: msg.result,
        })
        var barcodeArr = This.data.barcodeArr;
        barcodeArr.push({ barCode: e.detail.value });
        console.log(barcodeArr);
        This.setData({
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
  
  deleteSample:function(e){
    var This = this;
    var currentBarcode =e.currentTarget.dataset.barcode;
    
    wx.showModal({
      title: '确认删除？',
      content: '确定要移除此标本吗？',
      success: function(yes){

        if(yes.confirm){
         
          var arr = This.data.barcodeArr;
          for (var i = 0; i < arr.length;i++){
           
            if (arr[i].barCode == currentBarcode){
              arr.splice(i,1);
            }
          }
          
          This.setData({
            barcodeArr:arr 
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
                //console.log(That.data.filePaths)
                getApp().snGet("/batch/getApply",{
                    token: That.data.token,
                    psn: That.data.psn
                },function(res){
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
  end1: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }

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
  modifyPhoto:function(e){
    var This=this;
    this.setData({
      itemAndPhoto: false,
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

    barcodeArr.push({ barCode: e.detail.value});


    this.setData({
      barcodeArr:barcodeArr
    })
  
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

    wx.getStorage({
      key: 'item',
      success: function (res) {
        //console.log(res)
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
        // if (e.detail.value == "") {
        //   This.setData({
        //     applyItems: res.data
        //   })
        //   return;
        // }

        var arr = [];
        var arrForSelect = [];
        var selectArr = This.data.applyItemId;
        for (let i in res.data) {
          //console.log(this.data.hosList[i])
          res.data[i].show = false;

          if (res.data[i].search.indexOf(e.detail.value) >= 0) {

            //res.data[i].show = true;
            arr.push(res.data[i])
          }
          for (let j = 0; j < selectArr.length; j++) {
            if (selectArr[j] == res.data[i].applyItemId) {
              arrForSelect.push(res.data[i]);
            }
          }
        }
        if (arr.length == 0) {
          This.setData({
            applyItems: [{ show: true, applyItemName: '无相关数据' }]
          })
        } else {
          for (let i = 0; i < arrForSelect.length; i++) {

            arr.push(arrForSelect[i])
          }//arr是个新数组 包含搜索的和已选的


          var newarr = This.getNewObjArr(arr);//新数组去掉重复的        
          for (let i = 0; i < selectArr.length; i++) {
            for (let j = 0; j < newarr.length; j++) {
              if (newarr[j].applyItemId == selectArr[i]) {
                newarr[j].checked = true;
                break;
              }
            }
          }

          This.setData({
            applyItems: newarr
          })
        }

      },
    })
  },
  getNewObjArr: function (data) {
    var newData = [];
    for (var i = 0, len = data.length; i < len; i++) {
      var flag = 1;
      for (var j = 0, len2 = newData.length; j < len2; j++) {
        if (newData[j].applyItemId === data[i].applyItemId) {
          flag = 0;
          break;
        }
      }
      flag === 1 ? newData.push(data[i]) : false;
    }
    return newData;
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
              startCode:This.data.startCode,
              endCode: This.data.endCode
            },
            success:function(msg){
             //console.log(msg)
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
          //console.log(res.data.data.psn)
          This.setData({
            psn: res.data.data.psn
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
     // console.log(res)
      This.setData({
        sampleList: res.data.data.appBatchCodeList,
        sample: e.currentTarget.dataset.psn
      })
    })
  },
  examineItem:function(e){
    var This=this;
    This.setData({
      isitem: false,
      isExamine: false,//查看批次详情
      itemAndPhoto: true,//录项目 拍照容器
      psn: e.currentTarget.dataset.psn
    })

    getApp().snGet("/batch/getItem",{
      token:This.data.token,
      psn: e.currentTarget.dataset.psn
    },function(res){
      //console.log(res)
      var str = "";
      for (let i = 0; i < res.data.data.appSampleItemList.length;i++){
        str += res.data.data.appSampleItemList[i].applyItemName+",";
      }
      str = str.substr(0,str.length-1);
      This.setData({
        itemStr:str
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
        isExamine:false,
        itemStr:""
      });
      wx.setNavigationBarTitle({
        title: '上传申请单',
      })
      getApp().snPost("/batch/itemInput",{
        token:This.data.token,
        psn:This.data.psn,
        itemStr: This.data.applyItemId
      },function(res){
        //console.log(res)
        if(res.data.success){
          getApp().hnToast("录入成功")
          getApp().snGet("/batch/getApply", {
            token: This.data.token,
            psn: This.data.psn
          }, function (res) {
            //console.log(res.data.data.appApplySampleList)
            This.setData({
              photos: res.data.data.appApplySampleList
            })
          });
        }else{
          getApp().hnToast(res.data.message);
          return false;
        }
      })
      
  },
  complate: function () {
    this.getPsn();
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