import { PromiseHandler } from '../helpers';
import { GraphQLDriver } from '../drivers';

const graphql = GraphQLDriver.getInstance();
const { gql } = graphql;

type ReadingFilter = {
    from?: string
    to?: string
    last?: number
    first?: number
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
  let filterString = getFilterString(filter);
    const query = gql`    
        query{
          readings(deviceId:"${id}"${filterString}){
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

function getFilterString(filter:any){
  if(!filter) return '';
  
  const filterArray:string[] = Object.keys(filter).map((key:any)=>`${key}:${filter[key]}`);
  return `,filter:{${filterArray.join(',')}}`;
}

export default device;