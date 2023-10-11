const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postContent: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postImage: {
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        red: "Comment"
    }]

}, { timestamps: true })

const Post = mongoose.model("Post", postSchema);

module.exports = Post;