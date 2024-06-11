import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserInput {
  email: string;
  username: string;
  password: string;
  birth: Date;
  business?: string;
  dni: string;
  phone: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  birth: {type: Date, required: true},
  business: String,
  dni: {type: String, required: true, unique: true},
  phone: {type: String, required: true},
  // add cart reference id
}, {
  timestamps: true
})

// this runs previously from calling user.save()
userSchema.pre("save", async function(next){
  // For better understandment of the line below, image we do 'await user.find()', if we modify a value
  // and later call user.save(), 'this' will reference the user object,
  // now we can retrieve this.name that outputs 'Rafael2884'
  let user = this as UserDocument;

  if(!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'))
  const hash = bcrypt.hashSync(user.password, salt)

  user.password = hash;

  return next();
});

// this creates a method that can be called by user.comparePassword('superSecretPassword');
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
 const user = this as UserDocument;

 return bcrypt.compare(candidatePassword, user.password).catch(e => false)
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;