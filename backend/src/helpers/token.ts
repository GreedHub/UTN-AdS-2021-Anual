import * as  jwt from 'jsonwebtoken'
import { PromiseHandler } from './';
import { AccessCertController, RefreshCertController } from '../controllers'

let options: Object;

const {
  ATOKEN_EXPIRETIME,
  ATOKEN_ALGORYTHM,
  RTOKEN_EXPIRETIME,
  RTOKEN_ALGORYTHM,
} = process.env;

function signJwt(payload, signOptions, keys) {
  const jwtSignOptions = Object.assign({}, signOptions, options);
  return jwt.sign(payload, keys.privateKey, jwtSignOptions);
}

export async function generateAccessToken(username:string, id:string){
  const certController = AccessCertController.getInstance();
  const [certs,error]  = await PromiseHandler(certController.getCerts())
  if(error) throw new Error(error);
  
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

  const certController = RefreshCertController.getInstance();
  const [certs,error]  = await PromiseHandler(certController.getCerts())
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
  const certController = AccessCertController.getInstance();
  const [certs,error]  = await PromiseHandler(certController.getCerts())
  if(error) throw new Error(error);
  return _verifyToken(token, certs.pub, certs);
}

export async function verifyRefreshToken(token:string){
  const certController = RefreshCertController.getInstance();
  const [certs,error]  = await PromiseHandler(certController.getCerts())
  if(error) throw new Error(error);
  return _verifyToken(token, certs.pub,certs);
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

