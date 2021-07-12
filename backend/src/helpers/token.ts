import * as  jwt from 'jsonwebtoken'
import { getAccessCerts, getRefreshCerts, PromiseHandler } from './';

let secretOrPrivateKey: String;
let secretOrPublicKey: String;
let options: Object;




const {
  ATOKEN_EXPIRETIME,
  ATOKEN_ALGORYTHM,
  ATOKEN_PUBKEY,
  ATOKEN_PRIVKEY,
  ATOKEN_PASS,
  RTOKEN_EXPIRETIME,
  RTOKEN_ALGORYTHM,
  RTOKEN_PUBKEY,
  RTOKEN_PRIVKEY,
  RTOKEN_PASS,
} = process.env;

function signJwt(payload, signOptions, keys) {
  const jwtSignOptions = Object.assign({}, signOptions, options);
  return jwt.sign(payload, keys.privateKey, jwtSignOptions);
}

export async function generateAccessToken(username:string, id:string){
  const [certs,error]  = await PromiseHandler(getAccessCerts())
  if(error) throw new Error(error);
  console.log(certs)
  
  const options = {
    algorithm: ATOKEN_ALGORYTHM, 
    keyid: '1', 
    noTimestamp: false, 
    expiresIn: ATOKEN_EXPIRETIME, 
    notBefore: '2s' 
  }

  const keys = {
    key: certs.priv,
  }
  
  return signJwt({username,id},options,keys);
}

export async function generateRefreshToken(username:string, id:string){

  const [certs,error]  = await PromiseHandler(getRefreshCerts())
  if(error) throw new Error(error);

  const options = {
    algorithm: RTOKEN_ALGORYTHM, 
    keyid: '1', 
    noTimestamp: false, 
    expiresIn: RTOKEN_EXPIRETIME, 
    notBefore: '2s' 
  }

  const keys = {
    key: certs.priv,
  }

  return signJwt({username,id},options,keys);
}

export async function verifyAccessToken(token:string){
  const [certs,error]  = await PromiseHandler(getAccessCerts())
  if(error) throw new Error(error);
  return _verifyToken(token, ATOKEN_PUBKEY,certs);
}

export async function verifyRefreshToken(token:string){
  const [certs,error]  = await PromiseHandler(getRefreshCerts())
  if(error) throw new Error(error);
  return _verifyToken(token, RTOKEN_PUBKEY,certs);
}

function _verifyToken(token:string,publicKey:string,certs:any){

  /* TODO: check how to validate with public key */
  return jwt.verify(token,certs.pub,(err, decoded)=>{
  
      if(err){
          console.log(err);
          return false;
      }

      return true;
          
  });
  
}

