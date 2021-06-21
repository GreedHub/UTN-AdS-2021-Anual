require('dotenv').config({ path: './.env' })
import * as express from 'express';
const bodyParser = require( 'body-parser');
const helmet = require( 'helmet');
const cors = require( 'cors');

import {MQTTController} from './controllers'
import {  HealthRouter } from './routes';
const {PORT} = process.env;

const originsEnv:string = process.env.CORS_ENABLED_ORIGINS || '';
const origins:string[] = originsEnv.split(",") || [];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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