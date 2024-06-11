// use 'npx ts-node .\seeding.ts' to run this file

import mongoose from 'mongoose';
import AppConfigModel from '../models/appConfig.model';
import UserModel from '../models/user.model';
import categories from './categories';
import productProps from './productProps';
import locations from './locations';

// Seed the data
async function seedData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SoundPro');
    console.log('DB connected')

    const user = await UserModel.create({
      email: 'admin@admin.com',
      username: 'admin',
      password: '123456',
      birth: new Date(2000, 1, 1),
      dni: '12345678Z',
      phone: '123456789'
    });


    const appConfig = new AppConfigModel({
      config: {
        categories,
        productProps,
        locations,
        admins: [user._id]
      },
      previousConfigs: []
    });


  
    await appConfig.save();
    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the seeding function
seedData();


