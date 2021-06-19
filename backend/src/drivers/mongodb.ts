import * as mongoose from 'mongoose';

const MongoDBDriver = {
  connect,
}

async function connect(url){
  let mongodb = await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

  mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
  })

  return mongodb;
}

export default MongoDBDriver;