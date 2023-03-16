const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const {Conversation} = require('./conversation.model')

const userSchema = new mongoose.Schema(
  {
    prenom:{
      type:String,
      required:[true,'Please enter a prenom']
    },
    nom:{
      type:String,
      required:[true,'Please enter a nom']
    },
    picture:{
      type: String
    },
    datenaissance:{
      type:Date,
      //required:[true,'Please enter a date of birth']
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    state: {
      type: String,
      //required: true,
      enum: ['actif', 'en attente', 'inactif']
    },
    cin: {
      unique: true,
      type: String,
      required: [true, 'enter a valid CIN']

    },
    cne: {
      unique: true,
      type: String,
      required: [true, 'enter a valid CNE']
    },
    notificaion: [new mongoose.Schema({
      type: String,
      content: String,
      url: String,
      etat: ['unread', 'viewed', 'read'],
      date: {
          type: Date,
          default: Date.now()
      }
    })],
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }], 
    conversation: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    }]
});

// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;