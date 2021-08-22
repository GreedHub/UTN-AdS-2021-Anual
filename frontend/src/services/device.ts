import { PromiseHandler } from '../helpers';
import { GraphQLDriver } from '../drivers';

const graphql = GraphQLDriver.getInstance();
const { gql } = graphql;

type ReadingFilter = {
    from: string
    to: string
}

const device =  {
  getDevices,
  getDeviceReadings,
}

async function getDevices(){

  const query = gql`    
    devices{
        id,
        name,
    }
  `

  const [data,err] = await PromiseHandler(graphql.request(query))
  if(err) throw new Error(err);

  return data;

}

async function getDeviceReadings(id:string,sensorName?:string,filter?:ReadingFilter){
    const query = gql`    
        query{
          readings(deviceId:"${id}"){
              timestamp,
              name,
              type,
              value,
              magnitude 
          }  
      } 
    `

  const [data,err] = await PromiseHandler(graphql.request(query))
  if(err) throw new Error(err);

  return data;
}

export default device;