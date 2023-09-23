const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,

    },
    bio: {
        type: String,

    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;