import { generateCerts, verifyCert, getCerts } from "../helpers";
import { ICerts } from "../types";

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
export class AccessCertController extends CertController{
  private static instance:AccessCertController

  private constructor(path:string,name:string){
    super(path,name);
  }

  static getInstance(){
    if(AccessCertController.instance) 
      return AccessCertController.instance;
    
    AccessCertController.instance = new AccessCertController('./certs/access',"AccessCert")
    return AccessCertController.instance;
  }

}

export class RefreshCertController extends CertController{
  private static instance:RefreshCertController

  private constructor(path:string,name:string){
    super(path,name);
  }

  static getInstance(){
    if(RefreshCertController.instance) 
      return RefreshCertController.instance;
    
      RefreshCertController.instance = new RefreshCertController('./certs/refresh',"RefreshCert")
    return RefreshCertController.instance;
  }
  
}




