const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    }

}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;