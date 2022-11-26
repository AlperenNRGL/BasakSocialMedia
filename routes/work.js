const express = require("express");
const router = express.Router();

const { User } = require("../models/user-model");


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
    res.send("İmage OK")

})


router.get("/dir-list", async (req, res) => {
    const result = fs.readdirSync( __dirname + "/../doc/uploads" );
    res.send(result);
})


module.exports = router;

