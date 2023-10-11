if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/.env' });
}
//import depencies
const express = require("express");
const connection = require("./config/connection");
const userController = require("./controllers/usersController");
const postController = require("./controllers/postsController");
const commentController = require("./controllers/commentsController");
const messageController = require("./controllers/messagesController");
const cors = require("cors");
const upload = require("./middleware/uploader");
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');

//create app of express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:3001", "https://wepostnow.onrender.com"]
}));


app.use(express.json());


connection();

/*users routes*/
app.post("/signup", upload.single('profileImg'), userController.createUser);
app.post("/fetch-user", userController.fetchUser);
app.post("/login", userController.login);
app.get("/logout", userController.logout);
app.get("/profile/:id", userController.viewProfile);
app.post("/search-user", userController.searchUser);
app.post("/update-profile", upload.single('profileImg'), userController.updateProfile);
app.post("/update-password", userController.changePassword);
app.post("/forgot-password", userController.forgotPassword);
app.post("/reset-password/:id/:token", userController.resetPassword);

/*posts routes*/
app.post("/create-post", upload.single('postImage'), postController.createPost);
app.post("/posts", postController.fetchAllPosts);
app.get("/posts/userposts/:id", postController.fetchUserPosts);

/*comments routes*/
app.post("/create-comment", commentController.createComment);
app.post("/fetch-comments", commentController.fetchComments);

/* messages routes */
app.post("/send-message", messageController.createMessage);
app.get("/fetch-convos/:id", messageController.fetchConversations);
app.get("/fetch-convo-messages/:id", messageController.fetchConvoMessages);



app.listen(port);

