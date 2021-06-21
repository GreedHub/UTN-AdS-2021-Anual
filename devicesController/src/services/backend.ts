import { request, gql } from 'graphql-request'
import { IReadingValue } from '../types';

const services = {
  createDevice,
  createReading,
}

function createDevice(id:string, name:string){

  const query = gql`
    mutation{ 
      createDevice(id:${id},name:${name}){
        id,
        name
      }
    }
  `
  return _makeGraphqlRequest(query);

}

function createReading(deviceId:string, timestamp:number, values:[IReadingValue]){

  const query = gql`
    mutation{
      createReading(
        deviceId:"${deviceId}",
        timestamp:${timestamp},
        values:[
          {
            name:"testTemp",
            type:"temperature",
            value:"20",
            magnitude:"C"
          },
          {
            name:"doorOpen",
            type:"bool",
            value:"false"
          }
        ]
      ){
        timestamp,
        values{
          name,
          type,
          value,
          magnitude
        }
      }
    }
  `

  return _makeGraphqlRequest(query);
}

function _makeGraphqlRequest(query:any){
  return new Promise((resolve,reject)=>{

    request(process.env.BACKEND_URL, query)
      .then(response=>{
        resolve(response)
      })
      .catch(err=>{
        reject(err)
      })
    
  })
}

export default services;