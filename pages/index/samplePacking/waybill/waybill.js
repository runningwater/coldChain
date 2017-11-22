// pages/index/samplePacking/waybill/waybill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      token:"",
      boxCode: "",//标本箱transportId（条码）拼接的字符串
      range: [],//接受地名称数组
      receiveArr: [],//接受地id 数组
      receiveId:"",//接受地id
      addr:"接收地",
      transportType:"请选择",
      transport:[],//运输方式列表
      transportArr:[],
      transportId:"",//运输方式id
      flag1:false,//运输方式1
      flag2: false,//运输方式2
      flag3: false,//运输方式3,
      nowtime:"请选择",//预计到达时间默认值，
      location:""
  },
  submit:function(e){
     // consoleconsole.log(e.detail.value);
      if (this.data.transportId==""){
          wx.showModal({
              title: '选择运输方式',
              content: '请选择运输方式',
          })
          return false;
      }

     // console.log(this.data.transportId)
      var data = e.detail.value;
      data.token=this.data.token;
      data.location = this.data.location;
      data.transportId = this.data.boxCode;
      wx.request({
          url: getApp().globalData.url +'/order/writeOrder',
          method: "POST",
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          data:data,
          success:function(msg){
             // console.log(msg)
              if (msg.data.success){
                  getApp().hnToast("提交成功");
                  wx.navigateBack({
                      delta:1
                  })
              }else{
                getApp().hnToast(msg.data.message);
              }

          }
      })

  },
  //接受地改变
  addrChange:function(e){
      //console.log(e)
      this.setData({
          addr: this.data.range[parseInt(e.detail.value)],
          receiveId: this.data.receiveArr[parseInt(e.detail.value)].receiveId
         
      })
  },
  //运输方式改变
  transportTypeChange:function(e){
      //console.log(this.data.transportArr[parseInt(e.detail.value)].code);
      var code = this.data.transportArr[parseInt(e.detail.value)].code;
     
      if (code == "1") {
         this.setData({
             flag1: true,
             flag2: true,
             flag3: false
            
         });
       } else if (code == "2"){
          this.setData({
              flag1: false,
              flag2: false,
              flag3: true
          });
      }else{
          this.setData({
              flag1: true,
              flag2: false,
              flag3: false             
          });
      }
      this.setData({
          transportType: this.data.transport[parseInt(e.detail.value)],
          transportId: this.data.transportArr[parseInt(e.detail.value)].code
      })
  },
  //选择预计到达时间
  timeChange:function(e){
      
      this.setData({
          nowtime: e.detail.value
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // console.log(options)
      var This = this;
      var nowTime = getApp().getTime().split(" ")[0];
      This.setData({
          boxCode: options.boxCode
      })
      wx.getLocation({
          success: function(res) {
              This.setData({
                  location: res.longitude + "," + res.latitude
              })
          },
      })
      wx.getStorage({
          key: 'token',
          success: function(res) {
              This.setData({
                  token: res.data
              })
              wx.request({
                  url: getApp().globalData.url +'/sample/getReceiveList',
                  data:{
                      token:res.data
                  },
                  success:function(msg){
                      //console.log(msg)
                      if(msg.data.success){
                          var range1 = [];
                          for(var i=0;i<msg.data.data.length;i++){
                              range1.push(msg.data.data[i].addressName)
                          }
                        This.setData({
                            range: range1,
                            receiveArr: msg.data.data
                        })
                      }else{
                          getApp().hnToast(msg.data.message)
                      }
                  }
              })
              wx.request({
                  url: getApp().globalData.url +'/order/transportTypeList',
                  data: {
                      token: res.data
                  },
                  success:function(msg){
                     // console.log(msg)
                      if (msg.data.success) {
                          var range1 = [];//临时数组
                          for (var i = 0; i < msg.data.data.length; i++) {
                              range1.push(msg.data.data[i].transportType)
                          }
                          This.setData({
                              transport: range1,
                              transportArr: msg.data.data                             
                          })
                      } else {
                          getApp().hnToast(msg.data.message)
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