import fs from 'fs'
import rimraf from 'rimraf'
import selfsigned from 'selfsigned'
import { ICert, ICerts } from '../types'

const { writeFile, readFile, rename } = fs.promises

export async function generateCerts(path:string = `./certs/`,name:string):Promise<boolean>{

  try{

      if(!fs.existsSync(`${path}/3/cert.pem`)){
        const create = [
          _createCert(`${path}/1/`,name),
          _createCert(`${path}/2/`,name),
          _createCert(`${path}/3/`,name),
        ]

        await Promise.all(create);

        return true;
      }
      
      const oldest:ICert = await _getCert(`${path}/3/`)
      const mustRefresh = await verifyCert(oldest); 

      if(!mustRefresh) return false;
      
      _deleteCert(`${path}/3/`);
      await _renameCerts(path);
      _createCert(`${path}/1/`,name);
      return true;
  }catch(error){
    throw new Error(error);
  }

}

export async function getCerts(path:string):Promise<ICerts>{
  try{    
    //TODO: Add paralelism
    const getCerts = [
      _getCert(`${path}/1`),
      _getCert(`${path}/2`),
      _getCert(`${path}/3`),
    ]

    const response = await Promise.all(getCerts);

    return {
      1:response[0],
      2:response[1],
      3:response[2],
    }
  }catch(error){
    throw new Error(error);
  }
}

export async function verifyCert(cert:ICert):Promise<Boolean>{
  return false;
}

async function _getCert(path:string):Promise<ICert>{

  try{
    const getCert = [
      readFile(`${path}/priv.pem`),
      readFile(`${path}/pub.pem`),
      readFile(`${path}/cert.pem`),
    ]

    const files = await Promise.all(getCert);

    return {
      priv: files[0].toString(),
      pub:  files[1].toString(),
      cert: files[2].toString(),
    };    
  }catch(error){
    throw new Error(error);
  }
}

async function _createCert(path:string,name:string,validDays:number=90){

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
      const write = [
        writeFile(`${path}priv.pem`,cert.private,{ flag: 'w' }),
        writeFile(`${path}pub.pem` ,cert.public,{ flag: 'w' }),
        writeFile(`${path}cert.pem`,cert.cert,{ flag: 'w' }),
      ]

      await Promise.all(write);
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