// index.js
// 获取应用实例
const app = getApp()
var mqtt = require('../../utils/mqtt.min')

Page({
  data: {
    message: 'Hello, World!',  // 初始显示的信息
  },
  onLoad: function(options) {
    var that = this;
    that.connectMqtt(); // 初始化MQTT连接
  },
  connectMqtt: function() {
    const that = this;  // 确保在回调函数中正确引用this
    const options = {
      connectTimeout: 4000,
      clientId: 'F403A235V5EFRWFDIK5KZ4PX',
      port: 1886,
      username: 'F403A235V5EFRWFDIK5KZ4PX',
      password: 'aeY2dgQptukC0mx8ntcESqk31iPKsIj5'
    }
    const client = mqtt.connect('wxs://broker.diandeng.tech:1886/mqtt', options)
    
    client.on('connect', (e) => {
      console.log('服务器连接成功');
      client.subscribe('/device/F403A235V5EFRWFDIK5KZ4PX/r', { qos: 0 }, function(err) {
        if (!err) {
          console.log('订阅成功');
        }
      });
    });

    client.on('message', function(topic, message) {
      console.log('收到' + message.toString());
      list = JSON.parse(message.toString())
      that.setData({
        list,
        markers: [{
          id: 0,
          latitude: list.data.gps[1],
          longitude: list.data.gps[0],
          width: 50, // 图标的宽度
          height: 50, // 图标的高度
          //iconPath: 'marker', // 图标的路径
          callout: { // 可以设置标记点上的标签
            content: '标记点',
            color: '#FF0000',
            fontSize: 14,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#000000',
            bgColor: '#ffffff',
            padding: 5,
            display: 'ALWAYS'
          }
        }]
      });
    });
  },
  taphere() {
    console.log('helloworld');
  }
})
