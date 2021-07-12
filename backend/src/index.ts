require('dotenv').config({ path: './.env' })
import { ApolloServer } from "apollo-server-express";

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

import { MongoDBDriver } from './drivers';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import models from './models';
import { generateAccessToken } from "./helpers";
import { AccessCertController, RefreshCertController } from "./controllers";

const originsEnv:string = process.env.CORS_ENABLED_ORIGINS || '';
const origins:string[] = originsEnv.split(",") || [];

const { PORT,MONGO_URL } = process.env;



async function startServer(){

  try{
    let controller = RefreshCertController.getInstance();
    let certs = await controller.getCerts();
    certs = await controller.getCerts();
    
    await MongoDBDriver.connect(MONGO_URL);

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(helmet());
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