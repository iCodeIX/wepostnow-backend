const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

const fetchComments = async (req, res) => {
    const { postId } = req.body;

    await Comment.find({ post: postId })
        .sort({ 'updatedAt': -1 })
        .populate('user')
        .then((data) => {
            res.json(data);
        })
        
}

const createComment = async (req, res) => {
    const { commentContent, userId, postId } = req.body;

    let commentId = "";

    await Comment.create({
        commentContent,
        post: postId,
        user: userId
    }).then((comment) => {
        commentId = comment._id;
        res.json(comment);
    })

    await Post.findOneAndUpdate({ "_id": postId }, {
        "$push": { "comments": commentId }
    }, { new: true, safe: true, upsert: true });

    await User.findOneAndUpdate({ "_id": userId }, {
        "$push": { "comments": commentId }
    }, { new: true, safe: true, upsert: true });



}


module.exports = {
    fetchComments,
    createComment
}