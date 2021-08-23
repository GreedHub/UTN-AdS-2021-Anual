import { request, gql } from 'graphql-request'
import { IDeviceReading } from '../types';

const services = {
  createDevice,
  createReading,
}

function createDevice(id:string, name:string){

  const query = gql`
    mutation{ 
      createDevice(id:"${id}",name:"${name}"){
        id,
        name
      }
    }
  `
  return _makeGraphqlRequest(query);

}

function createReading(deviceId:string, reading:IDeviceReading){

  const query = gql`
  mutation{
    createReading(
      deviceId:"${deviceId}",
      reading:{
        timestamp:"${Date.now()}",
        name:"${reading.name}",
        type:"${reading.type}",
        value:"${reading.value}",
        magnitude:"${reading.magnitude}"
      }
    ){
      value
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