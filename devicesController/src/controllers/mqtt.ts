import * as mqtt from 'mqtt';
import { MessageController } from '.';
const {
  MQTT_USER,
  MQTT_PASS,
  MQTT_CA,
  MQTT_CLIENT_CERT,
  MQTT_CLIENT_KEY,
  MQTT_BROKER_URL,
} = process.env;

const ca = Buffer.from(MQTT_CA, 'base64');
const cert = Buffer.from(MQTT_CLIENT_CERT, 'base64');
const key = Buffer.from(MQTT_CLIENT_KEY, 'base64');

var client;

const MQTTController = {
  sendMessage,
  subscribe,
  connect,
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

function connect(){
  client = mqtt.connect(MQTT_BROKER_URL,{protocol:'mqtts',username:MQTT_USER,password:MQTT_PASS,ca,cert,key});

  client.on('connect',() => {
    console.log(`Connected to ${MQTT_BROKER_URL}`)
    const topics = process.env.MQTT_TOPICS_SUBSCRIPTION.split(",");
    for(let k in topics){
      client.subscribe(topics[k])
      console.log(`Subscribed to ${topics[k]}`);
    }
  })
   
  client.on('message', function (topic, message) {
    const content = JSON.parse(message.toString());
    MessageController.processMessage({topic,content});
  
  })
}

export default MQTTController;