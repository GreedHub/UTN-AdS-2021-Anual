require('dotenv').config({ path: './.env' })
import { ApolloServer } from "apollo-server-express";

import express from 'express';
import {json,urlencoded} from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import { MongoDBDriver } from './drivers';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import models from './models';

const originsEnv:string = process.env.CORS_ENABLED_ORIGINS || '';
const origins:string[] = originsEnv.split(",") || [];

const { PORT,MONGO_URL } = process.env;



async function startServer(){

  try{
    
    await MongoDBDriver.connect(MONGO_URL);

    const app = express();
    app.use(json());
    app.use(urlencoded({extended: true}));
    app.use(cors({
        origin: origins,
        credentials: true,
      }));

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