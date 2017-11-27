// pages/index/myTask/myTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPoint: [0, 0],//初始化touchstart坐标
    token:"",
    location:"",
    lists: [],
    flag: false,
    nowtime:"09:00",
    display1:"block",//我的任务列表是否显示
    display2: "none",//新增任务 是否显示
    display3: "none",//已提交任务列表是否显示
    
    hospitalID:"",//医院ID
    hospitalIDList:[],
    hospitalList:[],//医院列表
    hospitalName:"",//医院名称
    auditTask:[],//提交后的任务列表
    active:'my',
    transform1: false,//中间按钮动画
    showOrNot:false//中间按钮
  },
  receiveSamples: function (event) {
    var This = this;
    var hosName = event.currentTarget.dataset.name;
    var statusName = event.currentTarget.dataset.status;
    var workId = event.currentTarget.dataset.workid;
    var hospitalId = event.currentTarget.dataset.hospitalid;
    var time = getApp().getTime(); 

   

    if (statusName=="已接收"){
       
      if (This.data.location!=""){
        wx.request({
          url: getApp().globalData.url + '/task/intoHospital',
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            token: This.data.token,
            workId: workId,
            //intoHosDate: time,
            location: This.data.location
          },
          success: function (msg) {
            console.log(msg)
            wx.redirectTo({
              url: 'receiveSamples/receiveSamples?hosName='
              + hosName + "&workId=" + workId + "&hospitalId=" + hospitalId,
            })
          }
        })
      }else{
        getApp().hnToast("正在获取地理位置信息，请稍等。。。")
      }   
    } else if (statusName == "未接收"){
      wx.showModal({
        title: '请先接收',
        content: '左滑接收，接收后才能进入后续操作',
      })
    }else{
      wx.showToast({
        title: '此任务已完成',
      })
    }
   
  },
  mytouchstart: function (e) {
    //开始触摸，获取触摸点坐标并放入数组中
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY],
      flag: false
    });
  },
  //触摸点移动 
  delMyTask: function (e) {
   var This = this;
    var workid = e.currentTarget.dataset.workid;
    var status = e.currentTarget.dataset.status;
    if (status!="未接收"){
      return false;
    }
   
   
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
      wx.showModal({
        title: '确认接收？',
        content: '确定要接收此项吗？',
        success: function (confirm) {
          if (confirm.confirm) {

            wx.getLocation({
              success: function (res) {

                var recevietime = getApp().getTime();

                wx.request({
                  url: getApp().globalData.url + '/task/postTaskStatus',
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    workId: e.currentTarget.dataset.workid,
                    token: This.data.token,
                    // recevieTime: recevietime,
                    location: This.data.location
                  },
                  success: function (res) {
                    // console.log(res);
                    if (res.data.success) {

                      wx.request({
                        url: getApp().globalData.url + '/task/getMyTask',
                        data: {
                          token: This.data.token
                        },
                        success: function (res2) {
                          //console.log(res2)
                          This.setData({
                            lists: res2.data.data
                          });
                        }
                      })
                    }

                  }
                })
              },
              fail: function () {
                wx.showModal({
                  title: '接收失败',
                  content: '获取经纬度信息失败',
                })
              }
            })
          }


        }
      })
    }
  },
  
  myTask:function(){
    this.setData({
      display1: "block",//我的任务列表是否显示
      display2: "none",//新增任务 是否显示
      display3: "none",//已提交任务列表是否显示
      active:'my',
      transform1: false
    })
    wx.setNavigationBarTitle({
      title: '我的任务'
    })
  },
  addTask: function () {
    this.setData({
      showOrNot:!this.data.showOrNot
    })
    if (this.data.showOrNot){
      this.setData({
        display1: "none",//我的任务列表是否显示
        display2: "block",//新增任务 是否显示
        display3: "none",//已提交任务列表是否显示
        transform1: true
      })
      wx.setNavigationBarTitle({
        title: '新建任务'
      })
    }else{
      this.setData({
        display1: "block",//我的任务列表是否显示
        display2: "none",//新增任务 是否显示
        display3: "none",//已提交任务列表是否显示
        active: 'my',
        transform1: false
      })
      wx.setNavigationBarTitle({
        title: '我的任务'
      })
    }
   
   

  },
  submitTask:function(){
    this.setData({
      display1: "none",//我的任务列表是否显示
      display2: "none",//新增任务 是否显示
      display3: "block",//已提交任务列表是否显示
      active:'already',
      transform1:false
    })
    wx.setNavigationBarTitle({
      title: '已提交任务'
    })
  },
  init:function(){
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        This.setData({
          token: res.data
        })
        wx.request({
          url: getApp().globalData.url + '/task/getMyTask',
          data: {
            token: res.data
          },
          success: function (res) {
            console.log(res);
            This.setData({
              lists: res.data.data
            });
          }
        })
        // 获取医院列表 task/getWorkerHospital
        wx.request({
          url: getApp().globalData.url + '/task/getWorkerHospital',
          data: {
            token: res.data
          },
          success: function (res) {
           // console.log(res);
            var reshospital = [];
            var hospitalIDList1=[];
            for(let i=0;i<res.data.data.length;i++){
              reshospital.push(res.data.data[i].hospitalName)
              hospitalIDList1.push(res.data.data[i].hospitalId)
            }
            This.setData({
              hospitalName: reshospital[0],
              hospitalID: hospitalIDList1[0],
              hospitalList: reshospital,
              hospitalIDList: hospitalIDList1
            });
          }
        })
        // 获取审核列表
        wx.request({
         
          url: getApp().globalData.url + '/task/getRequestTask',
          data: {
            token: res.data
          },
          success: function (res) {
            console.log(res);
            var req = res.data.data;
            for(let i=0;i<req.length;i++){
              req[i].show = false;
            }
            console.log(req)
            This.setData({
              auditTask: req
            })

          }
        })
      },
    })
  },
  showMsg:function(e){
    var index = parseInt(e.currentTarget.dataset.index);
    var key = "auditTask[" + index + "].show";
    var val = this.data.auditTask[index].show; 
    this.setData({
      [key]: !val
    })
    console.log(this.data.auditTask)
  },
  hospitalChange:function(e){
    console.log(e)
    this.setData({
      hospitalName: this.data.hospitalList[parseInt(e.detail.value)],
      hospitalID: this.data.hospitalIDList[parseInt(e.detail.value)],
    })
  },
  timeChange:function(e){   
    this.setData({
      nowtime:e.detail.value
    })
  },
  submit:function(e){  
    console.log(e)
    var This = this;
    var data = {
      token: This.data.token,
      hospitalId: e.detail.value.hospital,
      goOff: e.detail.value.estimateTime,
      remark: e.detail.value.remark
    };
    if(data.remark==""){
      wx.showModal({
        title: '请输入备注内容',
        content: '请输入备注内容',
      })
      return false;
    }
    wx.request({
      url: getApp().globalData.url + '/task/requestTask',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: function (msg) {
        // console.log(msg)
        if (msg.data.success) {
          getApp().hnToast("提交成功");
          This.init();
          This.myTask();
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
    var This =this;
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
      },
    })
    This.init();

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
    this.init();
  },

/*
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