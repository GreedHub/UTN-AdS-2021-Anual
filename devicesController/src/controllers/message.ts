import { BackendService } from "../services";
import { IMessage } from "../types";

const controller = {
  processMessage,
}

async function processMessage(message: IMessage){

  const {topic, value} = message ;

  const action = _getAction(topic);
  const deviceId = _getDeviceId(topic);

  switch(action){

    case 'reading':      
      await BackendService.createReading(deviceId,value.timestamp,value.values)
        .catch(err=>console.log(err))
      break;

    case 'register':
      await BackendService.createDevice(deviceId,value.name)
        .catch(err=>console.log(err))
      break;
    
    default:
      const response = `Unknown action for topic ${topic}`
      console.log(response)
      break;

  }

}

function _getAction(topic:string):string{
  return  (
    topic.includes('reading') 
      ? 'reading' 
      : topic.includes('register')
        ? 'register'
        : 'unknown'
  )

}

function _getDeviceId(topic:string):string{
  return topic.split('/')[1];
}

export default controller;