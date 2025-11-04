const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    validate: {
      validator: val => typeof val === 'string',
      message: 'Name must be a string'
    }
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be an integer'
    },
    min: [18, 'Minimum age is 18'],
    max: [100, 'Maximum age is 100']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, 'Email format is invalid']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^\d+$/, 'Phone must contain only digits']
  },
  password: {
    type: String,
    default: ''
  },
  address: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    region: {
      type: String,
      required: [true, 'Region is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [String],
    required: [true, 'Roles are required'],
    validate: {
      validator: arr => arr.every(role => typeof role === 'string'),
      message: 'All roles must be strings'
    }
  }
});

module.exports = mongoose.model('User', userSchema);
