const LoginController = {
  login,
  logout,
  register
}

function login(username:string,password:string){
  return new Promise((resolve,reject)=>{
    resolve(200);
  })
}

function logout(){

}

function register(){

}

export default LoginController