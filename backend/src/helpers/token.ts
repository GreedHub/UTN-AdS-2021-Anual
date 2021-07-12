import * as  jwt from 'jsonwebtoken'

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

export function generateAccessToken(username:string, id:string){
  const options = {
    algorithm: ATOKEN_ALGORYTHM, 
    keyid: '1', 
    noTimestamp: false, 
    expiresIn: ATOKEN_EXPIRETIME, 
    notBefore: '2s' 
  }

  const keys = {
    key: ATOKEN_PRIVKEY,
    passphrase: ATOKEN_PASS,
  }
  
  return signJwt({username,id},options,keys);
}

export function generateRefreshToken(username:string, id:string){
  const options = {
    algorithm: RTOKEN_ALGORYTHM, 
    keyid: '1', 
    noTimestamp: false, 
    expiresIn: RTOKEN_EXPIRETIME, 
    notBefore: '2s' 
  }

  const keys = {
    key: RTOKEN_PRIVKEY,
    passphrase: RTOKEN_PASS,
  }

  return signJwt({username,id},options,keys);
}

export function verifyAccessToken(token:string){
  return _verifyToken(token, ATOKEN_PUBKEY);
}

export function verifyRefreshToken(token:string){
  return _verifyToken(token, RTOKEN_PUBKEY);
}

function _verifyToken(token:string,publicKey:string){

  /* TODO: check how to validate with public key */
  return jwt.verify(token,publicKey,(err, decoded)=>{
  
      if(err){
          console.log(err);
          return false;
      }

      return true;
          
  });
  
}

