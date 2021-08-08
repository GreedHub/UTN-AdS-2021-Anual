require('dotenv').config({ path: './.env' })
import express from 'express';
import {json,urlencoded} from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import {MQTTController} from './controllers'
import {  HealthRouter } from './routes';
const {PORT} = process.env;

const originsEnv:string = process.env.CORS_ENABLED_ORIGINS || '';
const origins:string[] = originsEnv.split(",") || [];

const app = express();
app.use(json());
app.use(urlencoded({extended: true}));
app.use(helmet());
app.use(cors({
    origin: origins,
    credentials: true,
  }));
app.use(HealthRouter);

if(PORT) app.listen(PORT, ()=>{
  console.log(`App listening on http://localhost:${PORT}/`)
  MQTTController.connect();


});