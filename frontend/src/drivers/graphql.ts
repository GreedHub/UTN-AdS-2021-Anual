import { gql, GraphQLClient } from 'graphql-request'
import { api } from '../appConfig';
import { PromiseHandler } from '../helpers';

export default class GraphQLDriver{

  static instance:GraphQLDriver;
  private client:GraphQLClient;
  private endpoint:string;
  public gql:any;

  private constructor() {    
    this.endpoint = api.url;
    this.client = new GraphQLClient(this.endpoint, { headers: {} })
    this.gql = gql;
  }

  public static getInstance(){
    if(GraphQLDriver.instance) return GraphQLDriver.instance;

    GraphQLDriver.instance = new GraphQLDriver();
    return GraphQLDriver.instance;
  }

  async request(query:string,variables?:{}):Promise<any>{
    console.log(this)
    const [data,err] = await PromiseHandler(this.client.request(query, variables));
    if(err) throw new Error(err);
    return data;
  }

  addCredentials(token:string){
    this.client = new GraphQLClient(this.endpoint, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  }

}