const express = require("express");
const router = express.Router();

const { User } = require("../models/user-model");
const { Post } = require("../models/post-model");


const fs = require("fs")
const path = require("path")

router.get("/profilimage", async (req, res) => {
    let liste = []
    let users = await User.find().select("profilImage");
    users.forEach(user => {
        if(user.profilImage != "icons8-person-64.png"){
            liste.push(user._id)
        }
    });

    for (let i = 0; i < liste.length; i++) {
        const user = await User.findById(liste[i]).select(["profilImageData","profilImage"]);
        fs.writeFileSync(__dirname + `/../doc/uploads/${user.profilImage}`, user.profilImageData.data)
    }
    res.send("PROFİL İMAGE OK")
})

router.get("/postimage", async(req, res) => {

    const posts = await Post.find({"img.data": {$ne :null}}).select("_id");

    for (let i = 0; i < posts.length; i++) {
        const post = await Post.findById(posts[i]).select(["img.data","imgPath"]);
        fs.writeFileSync(__dirname + `/../doc/uploads/${post.imgPath}`, post.img.data);
        console.log(post.imgPath);
    }

    res.send("POST İMAGE OK")
})


router.get("/dir-list", async (req, res) => {
    const result = fs.readdirSync( __dirname + "/../doc/uploads" );
    res.send(result);
})


module.exports = router;

