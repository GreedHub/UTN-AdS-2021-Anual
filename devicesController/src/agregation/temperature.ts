import { MQTTController } from "../controllers";
import { PromiseHandler } from "../helpers";

const temperature = {
  agregation,
}

let posibleStatus = [
  "good",
  "alerted",
  "alarmed",
];

let values = {}

let lastStatus = "null";

async function agregation(temperature:number,deviceId:string){
  let status;
  if( temperature > 5 && temperature < 30) status = "good";
  if( temperature >= 30 || temperature <= 5) status = "alerted";
  if( temperature >= 40 || temperature <= 1) status = "alarmed";  
  let statusId = posibleStatus.indexOf(status);
  if( statusId === values[deviceId]) return;
  values[deviceId] = posibleStatus.indexOf(status);
  status = generalStatus();
  if( status === lastStatus) return;
  lastStatus = status;

  const [,err] = await PromiseHandler(
    MQTTController.sendMessage("distanciaVirtual/STATUS_LIGHT/set_status",`{"status":"${status}"}`)
  );
  if(err) throw new Error(err);

}

function generalStatus():string{
  let lastStatus = Object.keys(values).reduce((last,device)=>{
    return last >= values[device] ? last : values[device];
  },-1)
  return posibleStatus[lastStatus];
}

export default temperature;