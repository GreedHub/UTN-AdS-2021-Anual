import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isEmailVerified:{
    type: Boolean,
    required: true,
  },
  tenantId:{
    type: Number,
    required:true,
  },
  salt:{
    type: String,
    required: true,
  },
  sessions:{
    type: mongoose.Schema.Types.Array,
    required:true,
  }
});

const user = mongoose.model('user', userSchema);

export default user;