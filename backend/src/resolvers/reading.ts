import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    readings: async (parent, {deviceId,sensorName,filter}, { models: { deviceModel } }, info) => {
      
      let params:any[] = [
        { $match: { "id": deviceId } },
        { $unwind: "$readings"},
      ]

      if(sensorName) params.push({ $match: {"readings.name":sensorName} });
      if(filter?.from){
        params.push({ "$match" : {"$expr" : {"$gte" : [{"$toDouble" :"$readings.timestamp"} , filter.from]}}});
      }
      if(filter?.to){
        params.push({ "$match" : {"$expr" : {"$lte" : [{"$toDouble" :"$readings.timestamp"} , filter.to]}}});
      }
      if(filter?.last){        
        params.push({ "$sort" : { "readings.timestamp" : -1 } });
        params.push({ "$limit" : filter.last});
      }
      if(filter?.first){        
        params.push({ "$sort" : { "readings.timestamp" : 1 } });
        params.push({ "$limit" : filter.first});
      }
      params.push({ "$project": { "readings":1 } });
      
      
      const readings = await deviceModel.aggregate(params).exec();
      return readings.map(reading=>reading.readings);
    },
  },
  Mutation: {
    createReading: async (parent, { deviceId, reading }, { models: { deviceModel } }, info) => {
      try{
        await deviceModel.findOneAndUpdate({id:deviceId},{ $push: {readings: reading }})     
        return reading;
      }catch(err){
        throw new Error(err)
      }
    },
  },
  Reading: {
    id:        reading => reading._id,
    timestamp: reading => reading.timestamp,
    name:      reading => reading.name,
    type:      reading => reading.type,
    value:     reading => reading.value,
    magnitude: reading => reading.magnitude,
  },
};