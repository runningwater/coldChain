// pages/index/myTask/receiveSamples/scan/scanBag/samples/samples.js
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
   
    barCode: [],
    startPoint: [0, 0],//初始化touchstart坐标
    flag: false,
    applyItems: [],//项目列表
    isitem: true,
    applyItemId: [],//项目id
    itemAndPhoto:true,//录项目 拍照容器
    sampleId:"",//标本ID
    isAlreadyItem:false,//已选项目
    alreadyItem:"",//已选项目（项目名称字符串）
    photos: [],
    x: "",
    lock: false,
    barcode:"",//标本条码
    arr1:[],//数组1
    arr2: [],//数组2
    arr3: [],//数组3
    arr4: [],//数组4
    arr5: [],//数组5
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
  end1: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }

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
            url: getApp().globalData.url + '/sample/deleteSampleApply',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              attachId: attachId,
              sampleId: This.data.sampleId
            },
            success: function (msg) {

              if (msg.data.success) {
                wx.showToast({
                  title: '删除成功',
                })
                wx.request({
                  url: getApp().globalData.url + '/sample/getApplySample',

                  data: {
                    token: This.data.token,
                    sampleId: This.data.sampleId
                  },
                  success: function (msg) {
                    //console.log(msg)
                    if (msg.data.success) {
                      This.setData({
                        photos: msg.data.data
                      })
                    } else {
                      wx.showToast({
                        title: msg.data.message,
                      })
                    }
                  }
                })
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
  // 获取申请单图片
  getPhoto: function (token, sampleid){
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/sample/getApplySample',

      data: {
        token: token,
        sampleId: sampleid
      },
      success: function (msg) {
        //console.log(msg)
        if (msg.data.success) {
          This.setData({
            photos: msg.data.data
          })
        } else {
          wx.showToast({
            title: msg.data.message,
          })
        }
      }
    })
  },
  takePhoto: function (e) {
    var This = this;
    This.setData({
      isitem:false,
      itemAndPhoto: false
    });
    wx.setNavigationBarTitle({
      title: '上传申请单',
    })
    if (e.currentTarget.dataset.sampleidone == "" || e.currentTarget.dataset.sampleidone == null || e.currentTarget.dataset.sampleidone == undefined) { var sampleId = This.data.sampleId}else{
      var sampleId = e.currentTarget.dataset.sampleidone;
      This.setData({
        sampleId: sampleId
      })
      This.getPhoto(This.data.token, sampleId);
    }
     
  
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        var tempPaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.url + '/sample/uploadSampleApply',
          filePath: tempPaths[0],
          name: sampleId,
          formData: {
            token: This.data.token,
            sampleId: sampleId
          },
          success: function (msg) {
            console.log(msg)
            var data = JSON.parse(msg.data);
            if (data.success) {
              wx.showToast({
                title: '图片上传成功',
              })
              This.getPhoto(This.data.token, sampleId);
              This.init();
            } else {
              wx.showToast({
                title: '上传失败',
              })
            }
          }
        })
      },
    })
  },
  //扫描标本
  scanCode1: function () {
    var This = this;
    wx.scanCode({

      success: function (msg) {

        This.setData({
          barcode: msg.result, 
          isitem: false,
          isAlreadyItem: false
        })
        wx.setNavigationBarTitle({
          title: '项目录入',
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  //录入标本号
  scanSimple: function (e) {   
    this.setData({
      barcode: e.detail.value,
      isitem: false,    
      isAlreadyItem: false
    })   
    wx.setNavigationBarTitle({
      title: '项目录入',
    })
  },
  scanCode: function (sampleCode){
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/sample/scanSample',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: res.data,
              bagId: This.data.bagid,
              // scanTime: scanTime,
              recordId: This.data.recordid,
              hospitalId: This.data.hospitalId,
              barCode: sampleCode,
              location: This.data.location,
              transportId: This.data.transportid
            },
            success: function (msg) {
              //console.log(msg)
              if (msg.data.success) {
                This.setData({
                 // code: msg.data.data,
                  sampleId: msg.data.data.sampleId
                });
                wx.getStorage({
                  key: 'token',
                  success: function (res) {
                    if (res.data) {
                      This.setData({
                        token: res.data
                      })
                      getApp().snPost('/item/sampleItemInput', {
                        token: This.data.token,
                        sampleId: This.data.sampleId,
                        barCode: This.data.barcode,
                        applyItemId: This.data.applyItemId.join(","),
                        remark: ""
                      }, function (res) {
                        //console.log(res.data)
                        if (res.data.success) {
                          getApp().hnToast("录入成功");
                          This.init();
                          This.setData({
                            itemAndPhoto: false
                          });
                          wx.setNavigationBarTitle({
                            title: '上传申请单',
                          })
                        } else {
                          getApp().hnToast("请选择项目");
                        }
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
                          wx.getStorage({
                            key: 'item',
                            success: function (res) {
                              This.setData({
                                barCode: msg.data.data,
                                bagNum: msg.data.data.length,
                                isitem: false,
                                applyItems: res.data,
                                isAlreadyItem:false
                              })
                            },
                          })

                        
                        },
                        fail: function (err) {
                          console.log(err)
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
            fail: function (err) {
              console.log(err);
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
    var This = this;
    wx.getSystemInfo({
      success: function (res) {
        var width = parseInt(res.screenWidth);
      
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
        }
      },
    })

    wx.getStorage({
      key: 'item',
      success: function (res) {
       
        This.setData({
          applyItems: res.data
        })

      },
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
        var arrForSelect = [];
        var selectArr = This.data.applyItemId;//select item
        for (let i in res.data) {
          //console.log(this.data.hosList[i])
          res.data[i].show = false;

          if (res.data[i].search.indexOf(e.detail.value) >= 0) {

            // res.data[i].show = true;
            arr.push(res.data[i])
          }
          for (let j=0;j<selectArr.length;j++){
            if (selectArr[j] == res.data[i].applyItemId){
              arrForSelect.push(res.data[i]);
            }
           }
        }
        // console.log(arr);
        // console.log(arrForSelect)//选择的数组
        if (arr.length == 0) {
          This.setData({
            applyItems: [{ show: true, applyItemName: '无相关数据' }]
          })
        } else {
          //var ss = [];
          for (let i = 0; i < arrForSelect.length;i++){
           
            arr.push(arrForSelect[i])
           }//arr是个新数组 包含搜索的和已选的

    
          var newarr = This.getNewObjArr(arr);//新数组去掉重复的        
          for (let i = 0; i < selectArr.length;i++){
            for(let j=0;j<newarr.length;j++){
              if (newarr[j].applyItemId == selectArr[i]){
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
  getNewObjArr:function(data) {
    var newData = [];
    for(var i = 0, len = data.length; i<len; i++) {
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
    console.log(e.detail.value)
    this.setData({
      applyItemId: e.detail.value,
    
    })
  },
  // 确认录入（下一步）
  confirminput: function () {
    var This = this;
   
    This.scanCode(This.data.barcode);
    //This.getPhoto(This.data.token, This.data.sampleId);
    This.setData({
      photos:[]
    })
  },
  inputItem:function(e){
    var This=this;
    This.setData({
      isAlreadyItem:true,
      sampleId: e.target.dataset.sampleid,
      barCode: e.target.dataset.barcode
      
    })
   //console.log(e.target.dataset.sampleid)
    getApp().snGet('/item/getSampleApplyItem',{
      token: This.data.token,
      sampleId: e.target.dataset.sampleid,  
    },
    function(msg){
      //console.log(msg.data.data)
      var alreadyItem = "";//临时已选项目 字符串
      for (let i = 0; i < msg.data.data.length;i++){
        alreadyItem += msg.data.data[i].applyItemName+",";
      }
      alreadyItem = alreadyItem.substr(0, alreadyItem.length-1);
      //console.log(alreadyItem)
      wx.getStorage({
        key: 'item',
        success: function (res) {
          This.setData({
            itemAndPhoto: true,
            isitem: false,
            applyItems: res.data,
            alreadyItem: alreadyItem
          })
        },
      })
      wx.setNavigationBarTitle({
        title: '重新选择项目',
      })
    })


  },
  complate:function(){
    this.setData({
      isitem:true,
      itemAndPhoto:true
    })
    wx.setNavigationBarTitle({
      title: '扫描标本',
    })
  },
  complete: function () {
   
    wx.navigateBack({
      delta: 1
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