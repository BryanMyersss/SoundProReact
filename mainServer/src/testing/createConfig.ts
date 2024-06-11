// use 'npx ts-node .\seeding.ts' to run this file

import mongoose from 'mongoose';
import appConfigModel from '../models/appConfig.model';
import props from '../../../client/src/data/productProps'


// Seed the data
async function seedData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/SoundPro');
    console.log('DB connected')

    const appConfig = new appConfigModel({
      config: {
        categories: ['', 'speaker', 'subwoofer', 'mixer', 'microphone', 'lighting', 'visual-FX',
        'audio-amp', 'instrument', 'dj-mixer']
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