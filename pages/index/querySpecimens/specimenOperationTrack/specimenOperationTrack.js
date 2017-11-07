// pages/index/querySpecimens/specimenOperationTrack/specimenOperationTrack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    polyline:[      
      {
        points:[        
        
        ],
        width:2,
        color:"#00f",
        dottedLine:true
      }
    ],//经纬度数组
    // controls: [{
    //   id: 1,
    //  iconPath: '',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }],
    latitude:"",
    longitude:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sampleid = options.sampleid;
    wx.getLocation({
      type:"gcj02",
      success: function(res) {
       // console.log(res)
        This.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/sample/getTrackSample',
           
            data: {
              token: res.data,
              sampleId: sampleid
            },
            success: function (msg) {
              // console.log(msg)
              var gps = [];
              if (msg.data.success) {
                for (var i = 0; i < msg.data.data.length;i++){
                  if (msg.data.data[i].gps!=""){
                   
                    var s =msg.data.data[i].gps.split(",");
                    gps.push({ latitude:s[1], longitude:s[0]})
                  }
                }
                This.data.polyline[0].points=gps;
                 This.setData({
                   polyline: [
                     {
                       points: gps,
                       width: 2,
                       color: "#f00",
                       dottedLine: true
                     }
                   ]
                 })
                // console.log(This.data.polyline[0].points)
              } else {
                wx.showToast({
                  title: "暂无数据"
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