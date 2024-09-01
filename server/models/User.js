const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    terms:{
      type:Boolean,
      required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    todos: {
        type: [{
          text: String,
          date: {
            type: Date,
            default: Date.now,
          },
        }],
        default: [], // This sets the default value to an empty array
    },
    score: {
      type: Number,
      default: 0,
    },
    score_hist:{
      type: Array,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationExpires: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
