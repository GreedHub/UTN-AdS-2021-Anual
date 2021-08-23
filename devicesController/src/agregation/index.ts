import { PromiseHandler } from '../helpers'
import temperature from './temperature';

export default async function agregation(type,content,deviceId){
  if(type === "temp"){
    const [,err] = await PromiseHandler(temperature.agregation(content.value,deviceId));
    if(err) console.log(err);
  }
}