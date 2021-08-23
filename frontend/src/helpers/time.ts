const time = {
  toLocalTime,
}

function toLocalTime(unix:string):string{
  const toInt = parseInt(unix);
  const date = new Date(toInt);
  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export default time;