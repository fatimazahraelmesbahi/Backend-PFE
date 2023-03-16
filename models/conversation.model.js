const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participent: [mongoose.Schema.Types.ObjectId],
  message: [new mongoose.Schema({
    sender: String,
    content: String,
    date: {
      type: Date,
      default: Date.now()
    },
    unread: [mongoose.Schema.Types.ObjectId]
  })]
})

const ConversationModel = mongoose.model("conversation", conversationSchema);

module.exports = ConversationModel;

