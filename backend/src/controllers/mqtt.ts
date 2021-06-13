import * as mqtt from 'mqtt';
const {MQTT_USER,MQTT_PASS,MQTT_CA,MQTT_CLIENT_CERT,MQTT_CLIENT_KEY} = process.env;

const ca = Buffer.from(MQTT_CA, 'base64');
const cert = Buffer.from(MQTT_CLIENT_CERT, 'base64');
const key = Buffer.from(MQTT_CLIENT_KEY, 'base64');

var client  = mqtt.connect('mqtt://broker.distanciavirtual.com.ar',{protocol:'mqtts',username:MQTT_USER,password:MQTT_PASS,ca,cert,key});
 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

export default client;