import * as mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const reading = mongoose.model('reading', readingSchema);

export default reading;