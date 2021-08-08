import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  readings: {
    type: mongoose.Schema.Types.Array,
    ref: 'reading',
  },
});

const device = mongoose.model('device', deviceSchema);

export default device;