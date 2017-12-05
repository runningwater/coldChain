// pages/index/audit/audit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      startPoint: [0, 0],//初始化touchstart坐标
      flag: false,
      token:"",
      taskList:[],//任务列表
      display1:"block",
      display2:"none",
      reqid:"",
      staus:""//审核状态

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

    var reqid = e.currentTarget.dataset.reqid;
    if (This.data.flag) {
      wx.showModal({
        title: '审核？',
        content: '是否通过审核？',
        confirmText:"通过",
        cancelText:"不通过",
        success: function (confirm) {
          This.setData({
            display1: "none",
            display2: "block",
            reqid: reqid
          })
          if (confirm.confirm) {

           
            This.setData({
              staus:"2"
            })
            }else{
            This.setData({
              staus: "3"
            })
           
            }

          }        
      })
    }
  },

  submit:function(e){
    var This = this;
    var data = {
      token:this.data.token,
      reqId:this.data.reqid,
      authRemark: e.detail.value.remark,
      status:this.data.staus
    }
    if (data.authRemark==""){
      wx.showModal({
        title: '填写原因',
        content: '请填写审核通过/不通过的原因',
      })
      return false;
    }
    wx.request({
      url: getApp().globalData.url + '/task/requestTaskAuth',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: function (msg) {
       
        if (msg.data.success) {
          getApp().hnToast("提交成功");
          This.init();
         
        } else {
          getApp().hnToast(msg.data.message);
        }

      }
    })
  },
  init:function(){
    var This =this;
    // 获取审核列表
 
   this.setData({
     display1: "block",
     display2: "none"
   })
    wx.request({

      url: getApp().globalData.url + '/task/getRequestTask',
      data: {
        token: This.data.token
      
      },
      success: function (res) {
        //console.log(res);
        var req = res.data.data;
        for (let i = 0; i < req.length; i++) {
          req[i].show = false;
        }
        This.setData({
          taskList: req
        })

      }
    })
  },
  showMsg: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var key = "taskList[" + index + "].show";
    var val = this.data.taskList[index].show;
    //console.log(val);
    this.setData({
      [key]: !val
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
          //console.log(res)
          This.setData({
            token:res.data
          })
          This.init();
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
    this.init();
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