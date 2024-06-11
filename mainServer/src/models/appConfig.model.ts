import mongoose from 'mongoose';

// Define the prop schema
export interface PropInput {
  propName: string;
  displayName: {
    default?: string,
    spanish?: string
  };
  description?: string;
  icon: string;
  lookupNames: {
    spanish: string[]
  };
  placeholder: {
    default?: string,
    spanish?: string
  };
  _id?: string;
}

export const propSchema = new mongoose.Schema({
  propName: {
    type: String,
    required: true
  },
  description: String,
  displayName: {
    default: String,
    spanish: String
  },
  icon: String,
  lookupNames: {
    spanish: [String]
  },
  placeholder: {
    default: String,
    spanish: String
  }
});


// Define the price decay schema
interface PriceDecayInput {
  active: boolean;
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
}

interface PriceDecayDocument extends PriceDecayInput, mongoose.Document { }

const priceDecaySchema = new mongoose.Schema({
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  day1: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  },
  day2: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  },
  day3: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  },
  day4: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  },
  day5: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  },
  day6: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  },
  day7: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    default: 0
  }
});


// Define the category schema
export interface CategoryInput {
  displayName: {
    default: string;
    spanish?: string;
    english?: string;
  };
  _id?: string;
}

export const categorySchema = new mongoose.Schema({
  displayName: {
    default: { type: String, required: true },
    spanish: { type: String },
    english: { type: String }
  }
});


// Define the location schema
export interface LocationInput {
  displayName: {
    default: string,
    spanish?: string
  };
  backgroundColor: string;
  _id?: string;
}

const locationSchema = new mongoose.Schema({
  displayName: {
    default: String,
    spanish: String
  },
  backgroundColor: String
});


// Define the config schema
export interface ConfigInput {
  categories?: CategoryInput[];
  discount?: {
    active: boolean;
    amount: number;
  };
  priceDecay?: PriceDecayDocument;
  locations?: LocationInput[];
  productProps?: PropInput[];
  admins?: string[];
  createdBy?: string;
}

export interface ConfigDocument extends ConfigInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const configSchema = new mongoose.Schema({
  categories: [categorySchema],
  discount: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    amount: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0
    }
  },
  priceDecay: {
    default: {
      type: priceDecaySchema,
    },
    presets: [priceDecaySchema]
  },
  locations: [locationSchema],
  productProps: [propSchema],
  admins: [String],
  createdBy: String
}, {
  timestamps: true
});

// Define the AppConfig schema
interface AppConfigDocument extends mongoose.Document {
  config: ConfigDocument;
  previousConfigs: ConfigDocument[];
}

const appConfigSchema = new mongoose.Schema({
  config: configSchema,
  previousConfigs: [configSchema],
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Define a pre-save hook to move the old config to previousConfigs
appConfigSchema.pre('save', function (next) {
  if (this.isModified('config')) {
    const oldConfig = this.get('config');
    this.previousConfigs.unshift(oldConfig);
    if (this.previousConfigs.length > 3) {
      this.previousConfigs.pop();
    }
  }
  next();
});

const AppConfigModel = mongoose.model<AppConfigDocument>('AppConfig', appConfigSchema);

export default AppConfigModel;