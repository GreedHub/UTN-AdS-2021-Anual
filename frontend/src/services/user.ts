import { PromiseHandler } from '../helpers';
import { GraphQLDriver } from '../drivers';

const graphql = GraphQLDriver.getInstance();
const { request, gql } = graphql;

const user =  {
  login,
  logout,
}

async function login(username:string,password:string){

  const query = gql`
    mutation Login($username:String!,$password:String!){
      login(object:{username:$username, password:$password}){
        token,
        refreshToken    
      }
    }
  `

  const variables = {
    username,
    password
  }

  const [data,err] = await PromiseHandler(request(query,variables))
  if(err) throw new Error(err);

  return data;

}

function logout(){

}

export default user;