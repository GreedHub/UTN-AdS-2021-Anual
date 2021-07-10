export default function PromiseHandler(promise:Promise<any>){
  return promise.then(data=>[data]).catch(err=>[null,err]);
}