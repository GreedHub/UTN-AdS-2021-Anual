export const api = {
  url:getApiHost(),
}

function getApiHost(){
  const url = window.location.hostname;
  return url.includes('localhost') 
    ? 'http://localhost:5000/graphql'
    : `https://api.distanciavirtual.com.ar/graphql`
}