const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
    const { postContent, userId } = req.body;
    let newPostId = "";
    
    await Post.create({
        postContent: postContent,
        user: userId

    }).then((post) => {
        newPostId = post._id;
        res.json(post);

    });

    await User.findOneAndUpdate({ "_id": userId }, {
        "$push": { "posts": newPostId }
    }, { new: true, safe: true, upsert: true });



}

const fetchAllPosts = async (req, res) => {
    const { userId } = req.body;

    if (userId) {
        await Post.find({ user: userId })
            .sort({ 'createdAt': -1 })
            .populate('user')
            .then((data) => {
                res.json(data);
            }
            );

    } else {
        await Post.find({})
            .sort({ 'createdAt': -1 })
            .populate('user')
            .then((data) => {
                res.json(data);
            }
            );

    }


}

module.exports = {
    createPost,
    fetchAllPosts
}