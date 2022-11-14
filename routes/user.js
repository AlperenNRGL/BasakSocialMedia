const express = require("express");
const isLogin = require("../middlewares/isLogin");
const router = express.Router();

const upload = require("../helpers/upload");
const { Post } = require("../models/post-model");
const { User } = require("../models/user-model");
const { Message } = require("../models/message-model");
const { FriendRequest } = require("../models/friends-request");
const fs = require("fs")
const path = require("path");

require("express-async-errors")

//! Hata var kullanıcı detay sayfasında !!!
//* Düzelttim :)




router.get("/friends/:id", isLogin, async (req, res) => {
    const user = await User.findById(req.params.id).populate("friends");
    const myuser = await User.findById(req.session.user).populate("messages.user").populate("messages.messages");

    const istek = await FriendRequest.find(({ istekuser: req.session.user, aliciuser: req.params.id }));
    const useristek = await FriendRequest.find(({ istekuser: req.params.id, aliciuser: req.session.user }));
    const arkadasmi = user.friends.find(f => f.username == myuser.username);
    let durum;
    if (istek.length != 0) {
        durum = "istekgonderildi";
    } else if (arkadasmi != undefined) {
        durum = "arkadaslar"
    } else if (useristek.length != 0) {
        durum = "kabulet"
    } else {
        durum = null;
    }



    res.render("user/friends", {
        user: user,
        durum: durum,
        messages: myuser.messages,
        myuser: myuser,


    })

})

router.get("/photos/:id", isLogin, async (req, res) => {

    const user = await User.findById(req.params.id);
    const posts = await Post.find({ user: req.params.id, image: { $ne: "null" } }).populate("user").limit(10);

    const myuser = await User.findById(req.session.user).populate("messages.user").populate("messages.messages");

    const istek = await FriendRequest.find(({ istekuser: req.session.user, aliciuser: req.params.id }));
    const useristek = await FriendRequest.find(({ istekuser: req.params.id, aliciuser: req.session.user }));
    const arkadasmi = user.friends.find(f => f.username == myuser.username);
    let durum;
    if (istek.length != 0) {
        durum = "istekgonderildi";
    } else if (arkadasmi != undefined) {
        durum = "arkadaslar"
    } else if (useristek.length != 0) {
        durum = "kabulet"
    } else {
        durum = null;
    }

    res.render("user/photos", {
        user: user,
        posts: posts,
        durum: durum,
        messages: myuser.messages,
        myuser: myuser,
    })

})


router.post("/replace-cover", isLogin, upload.single("coverimage"), async (req, res) => {
    const user = await User.findById(req.session.user);


    user.coverImage = {
        data: req.file == undefined ? "null" : fs.readFileSync(path.join(__dirname + '/../doc/uploads/' + req.file.filename)),
        contentType: req.file == undefined ? "null" : 'image/png'
    };
    await user.save();
    fs.unlinkSync(path.join(__dirname + '/../doc/uploads/' + req.file.filename))

    res.redirect(`/user/${user._id}`)
})


router.post("/replace-profil", isLogin, upload.single("profilimage"), async (req, res) => {
    const user = await User.findById(req.session.user);
    if (user.profilImage != "icons8-person-64.png" && user.profilImage != undefined) {
        fs.unlinkSync(__dirname + "/../doc/uploads/" + user.profilImage,(err => err?console.log(err):"null" ))
    }
    user.profilImageData = {
        data: req.file == undefined ? "null" : fs.readFileSync(path.join(__dirname + '/../doc/uploads/' + req.file.filename)),
        contentType: req.file == undefined ? "null" : 'image/jpeg'
    };
    user.profilImage = req.file.filename;
    await user.save();

    res.redirect(`/user/${user._id}`)
})


router.get("/profile-settings", isLogin, async (req, res) => {

    const user = await User.findById(req.session.user).populate("messages.user").populate("messages.messages");

    res.render("user/profile-settings", {
        user: user,
        messages: user.messages,
    })


})


router.post("/profile-settings", isLogin, async (req, res) => {
    const user = await User.findById(req.session.user).populate("messages.user").populate("messages.messages");

    const username = await User.find({ _id: { $ne: req.session.user }, username: req.body.username });
    if (username.length != 0) {
        res.render("user/profile-settings", {
            message: { class: "danger", text: "Bu username adresi daha öndeceden alınmış" },
            user: user,
            messages: user.messages,
        })
        return;
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.city = req.body.city;
    user.country = req.body.country;
    user.biyografi = req.body.biyografi;
    await user.save()

    return res.redirect("/user/profile-settings");


})


router.get("/:id", isLogin, async (req, res) => {
    const user = await User.findById(req.params.id).populate("friends");
    console.log(user.coverImage);
    const myuser = await User.findById(req.session.user).populate("messages.user").populate("messages.messages");
    const posts = await Post.find({ user: req.params.id })
        .sort({ date: -1 })
        .populate("user").populate("comments").populate("comments.user")
        .populate("comments.altcomment.user")
        .populate({ path: "like.user", select: { username: 1, profilImage: 1 } })
        .limit(10);



    const istek = await FriendRequest.find(({ istekuser: req.session.user, aliciuser: req.params.id }));
    const useristek = await FriendRequest.find(({ istekuser: req.params.id, aliciuser: req.session.user }));
    const arkadasmi = user.friends.find(f => f.username == myuser.username);
    let durum;
    if (istek.length != 0) {
        durum = "istekgonderildi";
    } else if (arkadasmi != undefined) {
        durum = "arkadaslar"
    } else if (useristek.length != 0) {
        durum = "kabulet"
    } else {
        durum = null;
    }


    return res.render("user/profile", {
        posts: posts,
        user: user,
        myuser: myuser,
        session: req.session.user,
        durum: durum,
        messages: myuser.messages,
    })

})


module.exports = router;