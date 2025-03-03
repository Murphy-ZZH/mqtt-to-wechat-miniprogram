// index.js
// 获取应用实例
const app = getApp()
import gcoord from '../../miniprogram_npm/gcoord/index.js'
import mqtt from '../../utils/mqtt.min.js'

Page({
  data: {
    message: 'Hello, World!',  // 初始显示的信息
    list: [],
    markers: [],
    result: [0, 0], // 初始化为默认坐标
    scale: 14 // 设置地图缩放级别
  },
  onLoad: function(options) {
    this.connectMqtt(); // 初始化MQTT连接
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
    const client = mqtt.connect('wxs://broker.diandeng.tech/mqtt', options)
    
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
      const list = JSON.parse(message.toString());

      // 解析经纬度
      const lat = list.data[1]; // 纬度
      const lon = list.data[2]; // 经度

      // 转换坐标系
      const result = gcoord.transform(
        [lon, lat],              // 经纬度坐标，注意顺序：[经度, 纬度]
        gcoord.WGS84,            // 当前坐标系
        gcoord.GCJ02             // 目标坐标系
      );
      console.log('转换后的坐标:', result);

      // 设置地图标记和显示的坐标
      that.setData({
        list,
        result, // 更新显示的坐标
        markers: [{
          id: 0,
          type: 'wgs84',
          latitude: result[1],   // 纬度
          longitude: result[0],  // 经度
          width: 30,             // 图标的宽度
          height: 30,            // 图标的高度
          callout: {             // 可以设置标记点上的标签
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
