import { generateCerts, verifyCert, getCerts } from "../helpers";
import { ICerts } from "../types";

export class AccessCertController{
  private static instance:CertController

  static getInstance(){
    if(AccessCertController.instance) 
      return AccessCertController.instance;
    
    AccessCertController.instance = new CertController('./certs/access',"AccessCert")
    return AccessCertController.instance;
  }

}

export class RefreshCertController{
  private static instance:CertController

  static getInstance(){
    if(RefreshCertController.instance) 
      return RefreshCertController.instance;
    
      RefreshCertController.instance = new CertController('./certs/refresh',"RefreshCert")
    return RefreshCertController.instance;
  }
  
}

class CertController{

  path:string;
  name:string;
  certs:ICerts;
  
  constructor(path:string,name:string){
    this.path = path;
    this.name = name;
  }

  async getCerts():Promise<ICerts>{
    
    try{
      const {path,name,certs} = this;

      /* Avoid hitting I/O for every call */
      if(certs)
        if(certs[3].cert)
          if(verifyCert(certs[3])){
            return certs;
          }

      await generateCerts(path,name);

      this.certs = await getCerts(path);
      return this.certs;

    }catch(error){
      throw new Error(error);
    }

  }
  
}


