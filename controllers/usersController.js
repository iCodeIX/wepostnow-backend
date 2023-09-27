
const User = require("../models/user");
const bcrypt = require("bcryptjs");


async function createUser(req, res) {
    const { username, email, password, gender } = req.body;
    const decodedPass = bcrypt.hashSync(password);
    const defaultAvatar = "https://res.cloudinary.com/df9i6l8cw/image/upload/v1695429568/userphoto/vuissdcq3kdpv9nd22ff.png";
    let userId = "";
   

    try {
        const userExist = await User.findOne({ username: username });
        const emailExist = await User.findOne({ email: email });
        if (userExist) {
            return res
                .status(422)
                .json({ error: "Username already exist" });
        }

        if (emailExist) {
            return res
                .status(422)
                .json({ error: "Email already exist" });
        }


        if (req.file) {
            let imgPath = req.file.path;
            await User.create({
                username: username,
                email: email,
                password: decodedPass,
                gender: gender,
                bio: "",
                profileImg: imgPath
            }).then((user) => {
                res.json(user);
                userId = user._id;
            })
        } else {

            await User.create({
                username: username,
                email: email,
                password: decodedPass,
                gender: gender,
                bio: "",
                profileImg: defaultAvatar
            }).then((user) => {
                res.json(user);
                userId = user._id;
            })


        }


    } catch (err) {
        console.log(err);
    }


}

async function fetchUser(req, res) {
    const { id } = req.body;

    await User.findOne({ _id: id })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(404).json({ error: "No user found!" })
        })
}


async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        const comparePass = bcrypt.compareSync(password, user.password);

        if (!comparePass) { return res.status(401).json({ error: "Username and Password dont match!" }); }

        res.json({ user });
    } catch (error) {
        console.log(error);
    }

}


const updateProfile = async (req, res) => {


    const { id, bio, gender } = req.body;

    if (req.file) {
        let imgPath = req.file.path;

        await User.findOneAndUpdate({ _id: id },
            {
                bio,
                profileImg: imgPath,
                gender
            }).then((response) => {
                res.json(response.data);
            }).catch((err) => {
                console.log(err);
            });
    } else {
        await User.findOneAndUpdate({ _id: id },
            {
                bio,
                gender

            }).then((response) => {
                res.json(response.data);
            }).catch((err) => {
                console.log(err);
            });
    }



}

const logout = (req, res) => {

    res.sendStatus(200);
}


const viewProfile = async (req, res) => {
    const id = req.params.id;

    await User.findById(id)
        .sort({ 'updatedAt': -1 })
        .populate('posts') // Populate the 'author' field with user data
        .then((user) => {
            res.json(user);
        }
        );


}

const searchUser = async (req, res) => {
    const searchText = req.body.searchText;


    await User.find({ username: { "$regex": searchText, "$options": "i" } })
        .then((data) => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
}


const changePassword = async (req, res) => {
    const { newPassword, oldPassword, userId } = req.body;
    const decodedNewPass = bcrypt.hashSync(newPassword);

    try {
        const user = await User.findOne({ _id: userId });
        const comparePass = bcrypt.compareSync(oldPassword, user.password);

        if (!comparePass) { return res.status(401).json({ message: "Old password is wrong!" }); }

        await User.findOneAndUpdate({ _id: userId }, {
            password: decodedNewPass
        }).then((data) => {
            return res.status(200).json({ message: "Password successfully changed!" });
        })
            .catch((err) => {
                console.log("error updating password!")
            });

    } catch (error) {
        console.log(error);
    }

}


module.exports = {
    createUser,
    fetchUser,
    login,
    updateProfile,
    logout,
    viewProfile,
    searchUser,
    changePassword
}