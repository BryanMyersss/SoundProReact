import mongoose from 'mongoose';

export interface CooldownInput {
  date: Date;
}

export interface CooldownDocument extends CooldownInput, mongoose.Document {}

const cooldownSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: new Date()
  }
})

const CooldownModel = mongoose.model<CooldownDocument>('Cooldown', cooldownSchema);

export default CooldownModel;