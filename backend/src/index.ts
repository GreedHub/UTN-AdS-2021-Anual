require('dotenv').config({ path: './.env' })
const express = require( 'express');
const bodyParser = require( 'body-parser');
const helmet = require( 'helmet');
const cors = require( 'cors');

import { LoginRouter, HealthRouter } from './routes';

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
app.use(LoginRouter);
app.use(HealthRouter);

if(process.env.PORT) app.listen(process.env.PORT);