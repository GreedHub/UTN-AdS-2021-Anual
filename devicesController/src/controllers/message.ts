import { BackendService } from "../services";
import { IMessage } from "../types";
import agregation from "../agregation";

const controller = {
  processMessage,
}

async function processMessage(message: IMessage){

  const {topic, content} = message ;

  const action = _getAction(topic);
  const deviceId = _getDeviceId(topic);

  switch(action){

    case 'reading':      
      const type = _getReadingType(topic);
      await BackendService.createReading(deviceId,{...content, type})
        .catch(err=>console.log(err))
      await agregation(type,content,deviceId);
      break;

    case 'register':
      await BackendService.createDevice(deviceId,content.name)
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

function _getReadingType(topic:string):string{
  const topicArray = topic.split('/')
  return topicArray.pop();
}

export default controller;