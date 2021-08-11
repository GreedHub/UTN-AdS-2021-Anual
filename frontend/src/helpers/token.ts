import { decode } from 'jsonwebtoken';

const token = {
    getPayload,
}

function getPayload(token:string):any{
    return decode(token);
}


export default token;