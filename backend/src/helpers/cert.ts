import * as fs from 'fs'
import * as rimraf from 'rimraf'
import * as selfsigned from 'selfsigned'
import { PromiseHandler } from '.'

const { writeFile, readFile, rename } = fs.promises
const ACERT_PATH = './certs/access';
const RCERT_PATH = './certs/refresh';

export async function getAccessCerts(){
  try{
    let certs = await _getCerts(ACERT_PATH);

    const needToRefresh:Boolean = await _isExpired(certs['3']);
    if(!needToRefresh) return certs;
  
    await generateAccessCerts();

    certs = await _getCerts(ACERT_PATH);
    
    return certs;
   
  }catch(error){
    if(error) throw new Error(error);
  }
}

export async function getRefreshCerts(){
  try{
    let certs = await _getCerts(RCERT_PATH);

    const needToRefresh:Boolean = await _isExpired(certs['3']);
    if(!needToRefresh)  return certs;
  
    await generateRefreshCerts();

    return await _getCerts(RCERT_PATH);
   
  }catch(error){
    if(error) throw new Error(error);
  }
}

export async function generateAccessCerts(){
  const [,error] = await PromiseHandler(_generateCerts(ACERT_PATH,"AccessCert"));
  if(error) throw new Error(error);
}

export async function generateRefreshCerts() {
  const [,error] = await PromiseHandler(_generateCerts(RCERT_PATH,"RefreshCert"));
  if(error) throw new Error(error);
}

async function _generateCerts(path:string = `./certs/`,name:string){

  try{
    
      if(!fs.existsSync(`${path}/1/priv.pem`)){
        _createCert(`${path}/1/`,name);
        _createCert(`${path}/2/`,name);
        _createCert(`${path}/3/`,name);
        return;
      }
      
      _deleteCert(`${path}/3/`);
      await _renameCerts(path);
      _createCert(`${path}/1/`,name);
  }catch(error){
    throw new Error(error);
  }

}

async function _getCerts(path:string){
  try{
    return {
      1: await _getCert(`${path}/1`),
      2: await _getCert(`${path}/2`),
      3: await _getCert(`${path}/3`)
    }
  }catch(error){
    throw new Error(error);
  }
}

async function _getCert(path:string){
  try{
    const priv = await PromiseHandler(readFile(`${path}/priv.pem`));
    const pub  = await PromiseHandler(readFile(`${path}/pub.pem`));
    const cert = await PromiseHandler(readFile(`${path}/cert.pem`));
    return {priv,pub,cert};    
  }catch(error){
    throw new Error(error);
  }
}

async function _createCert(path:string,name:string,validDays:number=30){

  try{    
      const attrs   = [{ name: 'commonName', value: name }];
      const options = {
        keySize: 2048, // the size for the private key in bits (default: 1024)
        days: validDays, // how long till expiry of the signed certificate (default: 365)
        algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
        extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
        pkcs7: true, // include PKCS#7 as part of the output (default: false)
      }
    
      const cert = await selfsigned.generate(attrs, options);
      
      _validateFilePath(path)
    
      await writeFile(`${path}priv.pem`,cert.private,{ flag: 'w' });
      await writeFile(`${path}pub.pem` ,cert.public,{ flag: 'w' });
      await writeFile(`${path}cert.pem`,cert.cert,{ flag: 'w' });
  }catch(error){
    throw new Error(error)
  }
}

function _deleteCert(path:string){
  return rimraf.sync(path);
}

async function _renameCerts(path:string){
  try{
    await rename(`${path}/2`,`${path}/3`)
    await rename(`${path}/1`,`${path}/2`)
  }catch(error){
    throw new Error(error)
  }
}

function _validateFilePath(path:string){
  path.split('/').slice(0,-1).reduce( (last, folder)=>{
      let folderPath = last ? (last + '/' + folder) : folder
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
      return folderPath
  })
}

async function _isExpired(cert:any):Promise<Boolean>{
  return false;
}