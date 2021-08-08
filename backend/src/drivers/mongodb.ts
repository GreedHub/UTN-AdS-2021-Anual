import * as mongoose from 'mongoose';

const MongoDBDriver = {
  connect,
}

async function connect(url:string){

  try{  

    mongoose.connection.once('open',()=>{
      console.log('Connected to MongoDB');
    })
    
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

  } catch(err) {
    throw new Error(err)
  }
}

export default MongoDBDriver;