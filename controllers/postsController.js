const Post = require("../models/post");
const User = require("../models/user");


const createPost = async (req, res) => {
    const { postContent, userId } = req.body;
    let newPostId = "";

    if (req.file) {
        let imgPath = req.file.path;

        await Post.create({
            postContent: postContent,
            user: userId,
            postImage: imgPath

        }).then((post) => {
            newPostId = post._id;
            res.json(post);

        });
    } else {


        await Post.create({
            postContent: postContent,
            user: userId,
            postImage: ""

        }).then((post) => {
            newPostId = post._id;
            res.json(post);

        });


    }


    await User.findOneAndUpdate({ "_id": userId }, {
        "$push": { "posts": newPostId }
    }, { new: true, safe: true, upsert: true });



}

const fetchAllPosts = async (req, res) => {

    await Post.find({})
        .sort({ 'createdAt': -1 })
        .populate('user')
        .then((data) => {
            res.json(data);
        }
        );

}

const fetchUserPosts = async (req, res) => {
    const id = req.params.id;

    if (id) {
        await Post.find({ user: id })
            .sort({ 'createdAt': -1 })
            .populate('user')
            .then((data) => {
                res.json(data);
            }
            );

    }


}

const deletePost = async (req, res) => {
    const { post_id } = req.body;
    await Post.deleteOne({ _id: post_id })
        .then((data) => {
            return res.json({ Success: "Post deleted" })
        })
        .catch(
            err => console.log(err)
        )

}

module.exports = {
    createPost,
    fetchAllPosts,
    fetchUserPosts,
    deletePost
}