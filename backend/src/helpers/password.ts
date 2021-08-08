import crypto from 'crypto';
import { promisify } from 'util';
const pbkdf2 = promisify(crypto.pbkdf2);
import { PromiseHandler } from '.';

export async function hashPassword(password:string,salt?:string){

  const {
    PASSWORD_ALGORYTHM, 
    PASSWORD_ITERATIONS, 
    PASSWORD_KEYLEN,
    PASSWORD_SALTLEN,  
  } = process.env;
  
  if(!salt) salt = createSalt(parseInt(PASSWORD_SALTLEN));

  const [hash, error] = await PromiseHandler(createHashedPassword(password,salt,parseInt(PASSWORD_ITERATIONS),parseInt(PASSWORD_KEYLEN),PASSWORD_ALGORYTHM));
  if(error) throw new Error(error);
  
  return hash;

}

export async function verifyPassword(attemp:string,password:string,salt:string):Promise<Boolean>{
  const [result, error] = await PromiseHandler(hashPassword(attemp,salt)); 
  if(error) throw new Error(error);

  const {hash} = result;
  
  return hash === password;

}

function createSalt(length:number){
  return crypto.randomBytes(length).toString('base64');
}

async function createHashedPassword(password:string,salt:string,iterations:number,keyLength:number,digest:string){
  const hashBuffer = await pbkdf2(password, salt, iterations, keyLength, digest);
  const hash = hashBuffer.toString('hex');

  return { hash, salt, iterations, keyLength, digest }
}