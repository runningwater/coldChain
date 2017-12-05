// pages/index/querySpecimens/temperatureChange/temperatureChange.js
var wxCharts = require('../../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;


Page({
  data: {
    lists:[]
  },
  touchHandler: function (e) {
   // console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },
  createSimulationData: function () {

    var categories = [];
    var data1 = [];//温度
    var data2 = [];//湿度
    
    for (var i = 0; i < this.data.lists.length; i++) {
     // console.log(this.data.lists[i]);
      categories.push(this.data.lists[i].createTime);
      data1.push(this.data.lists[i].temperature);
      data2.push(this.data.lists[i].humidity);
    }
    // data[4] = null;
   // console.log(categories);
    return {
      categories: categories,
      data1: data1,
      data2: data2
    }
  
  },

  onLoad: function (e) {
  var This = this;
    var sampleid = e.sampleid;
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
              var temp = [];
              if (msg.data.data.length > 0) {
                for (var i = 0; i < msg.data.data.length;i++){
                  temp.push({
                    createTime: msg.data.data[i].createTime,
                    humidity: msg.data.data[i].humidity,
                    temperature: msg.data.data[i].temperature})
                }
               // console.log(temp)
                This.setData({
                  lists :temp
                })
                var windowWidth = 320;
                try {
                  var res = wx.getSystemInfoSync();
                  windowWidth = res.windowWidth;
                } catch (e) {
                  console.error('getSystemInfoSync failed!');
                }

                var simulationData = This.createSimulationData();
                lineChart = new wxCharts({
                  canvasId: 'lineCanvas',
                  type: 'line',
                  categories: simulationData.categories,
                  animation: true,
                  background: '#f5f5f5',
                  series: [{
                    name: '温度',
                    data: simulationData.data1,
                    format: function (val, name) {
                      return val.toFixed(2) + '℃';
                    }
                  }, {
                    name: '湿度',
                    data: simulationData.data2,
                    format: function (val, name) {
                      return val.toFixed(2) + '%';
                    }
                  }],
                  xAxis: {
                    disableGrid: true
                  },
                  yAxis: {
                    title: '温湿度变化',
                    format: function (val) {
                      return val.toFixed(2);
                    },
                    min: 0
                  },
                  width: windowWidth,
                  height: 300,
                  dataLabel: false,
                  // dataPointShape: true,
                  // extra: {
                  //   lineStyle: 'curve'
                  // }
                });
                //console.log(This.data.lists)
              } else {
                wx.showToast({
                  title: "暂无数据",
                })
              }
            }
          })
        }
      },
    })
 
  }
});