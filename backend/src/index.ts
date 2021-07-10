require('dotenv').config({ path: './.env' })
import { ApolloServer } from "apollo-server-express";

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

import { MongoDBDriver } from './drivers';

import typeDefs from './types';
import resolvers from './resolvers';
import models from './models';
import { LoginRouter, HealthRouter } from './routes';

const originsEnv:string = process.env.CORS_ENABLED_ORIGINS || '';
const origins:string[] = originsEnv.split(",") || [];

const { PORT,MONGO_URL } = process.env;



async function startServer(){

  try{
    
    await MongoDBDriver.connect(MONGO_URL);

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

    const server = new ApolloServer({  
      typeDefs,
      resolvers,
      context: {
        models
      }
    });
    
    server.applyMiddleware({app});

    if(PORT) app.listen(PORT,()=>console.log(`App started on port ${PORT}`));

  }catch(err){
    console.error(err)
  }
}

startServer();