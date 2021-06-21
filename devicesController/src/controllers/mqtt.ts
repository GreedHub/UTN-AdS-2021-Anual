import * as mqtt from 'mqtt';
import { MessageController } from '.';
const {MQTT_USER,MQTT_PASS,MQTT_CA,MQTT_CLIENT_CERT,MQTT_CLIENT_KEY,MQTT_BROKER_URL} = process.env;

const ca = Buffer.from(MQTT_CA, 'base64');
const cert = Buffer.from(MQTT_CLIENT_CERT, 'base64');
const key = Buffer.from(MQTT_CLIENT_KEY, 'base64');

var client  = mqtt.connect(MQTT_BROKER_URL,{protocol:'mqtts',username:MQTT_USER,password:MQTT_PASS,ca,cert,key});
 
client.on('connect',() => {
  client.subscribe("distanciaVirtual/#")
  console.log(`Connected to ${MQTT_BROKER_URL}`)
})
 
client.on('message', function (topic, message) {

  const value = JSON.parse(message.toString());
  MessageController.processMessage({topic,value});

})

const MQTTController = {
  sendMessage,
  subscribe,
}

function sendMessage(topic:string,message:string){
  return new Promise((resolve,reject)=>{
    
    if(!isConnected()) {
      reject("MQTT Client not connected");
      return;
    }


    client.publish(topic,message);  
    resolve("Message sent successfully");

  })
}

function subscribe(topic:string){
  return new Promise((resolve,reject)=>{
    
    if(!isConnected()) {
      reject("MQTT Client not connected");
      return;
    }

    client.subscribe(topic,err=>{
      if(err) reject(err);
    });  

    resolve("Successfully subscribed");

  })
}

function isConnected(){

  if(!client.connected){
    client.reconnect();
  } 

  return client.connected;
}

export default MQTTController;