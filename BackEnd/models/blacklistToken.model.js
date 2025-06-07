import mongoose from 'mongoose';

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d', // Token will be removed after 1 day
  },    
});

const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistTokenSchema);
export default BlacklistedToken;
