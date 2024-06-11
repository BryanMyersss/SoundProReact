// use 'npx ts-node .\seeding.ts' to run this file

import mongoose from 'mongoose';
import AppConfigModel from '../models/appConfig.model';
import categories from './categories';
import productProps from './productProps';

// Seed the data
async function seedData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SoundPro');
    console.log('DB connected')


    const appConfig = await AppConfigModel.findOne({});
    if (!appConfig) throw new Error('App config not found');
    if (!appConfig.config) throw new Error('App config found, but there is no config');


    // appConfig.config.locations?.push(...newLocations);
    appConfig.config.categories?.push({displayName: {default: 'informática',}});
    // appConfig.config.productProps?.push(...productProps);

    // Mark the 'config' field as modified
    
    appConfig.markModified('config');
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


