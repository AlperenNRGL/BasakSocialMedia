const express = require("express");
const isLogin = require("../middlewares/isLogin");
const router = express.Router();

const upload = require("../helpers/upload");
const { Post, postValidate } = require("../models/post-model");
const { User } = require("../models/user-model");
const Message = require("../models/message-model");
const Nofication = require("../models/nofication-models");


const fs = require("fs")
const path = require("path")

router.get("/", isLogin, async (req, res) => {
    const success = req.query.account || undefined
    const sessionmessage = req.session.message || undefined;
    delete req.session.message

    //todo Tek giren kullanıcının değilde bütün arkadaşlarının postlarını göster.
    const user = await User.findById(req.session.user).populate("messages.user").populate("messages.messages").populate("friends", "_id");
    let id_list = [];
    for (let i = 0; i < user.friends.length; i++) {
        id_list.push(user.friends[i]._id)
    }
    id_list.push(user._id)
    const posts = await Post.find({ user: id_list })
        .sort({ date: -1 })
        .populate("user").populate("comments").populate("comments.user").populate("comments.altcomment.user")
        .populate({ path: "like.user", select: { username: 1, profilImage: 1 } })
        .limit(2);


    //? Suggested Friend
    let liste = []
    for (let i = 0; i < user.friends.length; i++) {
        liste.push(user.friends[i]._id)
    }

    const suggestedusers = await User.find({ _id: { $nin : liste} })
    .limit(5)
    .select(["username", "firstName", "lastName", "profilImage"]);


    const my = suggestedusers.find( u => u._id == req.session.user);
    if(my){
        const indexnumber = suggestedusers.indexOf(my);
        suggestedusers.splice(indexnumber, 1)
    }

    return res.render("home/index", {
        posts: posts,
        message: sessionmessage,
        user: user,
        messages: user.messages,
        suggestedusers: suggestedusers,

    });

})

router.post("/", upload.single("image"), isLogin, async (req, res) => {

    await new Promise(r => setTimeout(r, 500));

    await Post.create({
        user: req.session.user,
        text: req.body.text,
        img: {
            data: req.file == undefined ? "null" : fs.readFileSync(path.join(__dirname + `/../doc/uploads/${req.file.filename}`)),
            contentType: 'image/jpeg'
        }
    }, (err) => err?console.log(err):"")

    if (req.file != undefined) {
        fs.unlinkSync(path.join(__dirname + '/../doc/uploads/' + req.file.filename))
    }

    await new Promise(r => setTimeout(r, 2000));
    return res.redirect("/")
})


module.exports = router;

