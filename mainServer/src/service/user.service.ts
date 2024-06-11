import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';
import UserModel ,{ UserInput, UserDocument } from '../models/user.model';
import { getConfigAdmins } from './config.service';

export async function createUser(input: UserInput) {
  try {
    // I might be wrong, but the line below does two things combined, creates the user and then saves it to the db,
    // So in theory its the equivalent of: "const user = new User({name: 'ricky'}); await user.save()"
    const user = await UserModel.create(input);
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    throw new Error(e);
  }
}

// 
export async function validatePassword({
  emailOrUsername, 
  password
}:{
  emailOrUsername: string,
  password: string
}) {
  const isEmail = /\S+@\S+\.\S+/;
  const query = isEmail.test(emailOrUsername) ? { email: emailOrUsername } : { username: emailOrUsername };
  const user = await UserModel.findOne(query);

  if(!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if(!isValid) return false;

  return omit(user.toJSON(), 'password');
}

export async function findUser(query: FilterQuery<UserDocument>){
  return UserModel.findOne(query).lean();
}

export async function isAdmin(user: UserDocument){
  let isAdmin = false;
  const admins = await getConfigAdmins();
  if (admins) isAdmin = admins.includes(user._id);
    
  return isAdmin;
}