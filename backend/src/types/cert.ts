export interface ICert{
  pub:string,
  priv:string,
  cert:string,
}

export interface ICerts{
  1:ICert,
  2:ICert,
  3:ICert,
}