const express = require("express");
const isLogin = require("../middlewares/isLogin");
const logined = require("../middlewares/logined");
const { User, registerValidate } = require("../models/user-model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mailer = require("../helpers/mailer")


//? Login
router.get("/login", logined, (req, res) => {
    const success = req.query.account || undefined
    const sessionmessage = req.session.message || undefined ;
    delete req.session.message
    res.render("auth/login", { success: success , message : sessionmessage})
})

router.post("/login", async (req, res) => {
    
    const user = await User.findOne({ "email": req.body.email})
    .select(["email", "password"]);
    try{
        if (!user) {
            return res.render("auth/login",{message : {text :"Hatalı kullanıcı girişi", class : "danger" }})
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            return res.render("auth/login",{message : {text :"Hatalı kullanıcı girişi", class : "danger" }})
        }
    }catch(err){
        console.log(err);
    }
    req.session.user = user._id;
    req.body.session?req.session.cookie.maxAge = 1000* 60* 60* 24* 10:"";
    return res.redirect("/")

})


//? Register
router.get("/register", logined, (req, res) => {
    res.render("auth/register");
})
router.post("/register", async (req, res) => {

    const { value, error } = registerValidate.validate(req.body);
    if (error) {
        return res.render("auth/register", {
            message: {class : "danger" , text : error.details[0].message},
        })
    };
    const emailDuplicated = await User.findOne({ email: req.body.email });
    if (emailDuplicated) {
        return res.render("auth/register", {
            message: "Bu email adresi daha önceden alınmış"
        })
    }
    const user = await new User(req.body);
    user.password =  await bcrypt.hash(user.password,10)
    await user.save();
    //await mailer.sendMail({
    //    from: 'alperennuroglu@hotmail.com', // sender address
    //    to: user.email, // list of receivers
    //    subject: "Social'a Hoşgeldiniz", // Subject line
    //     html: "<h3>Sizi burada görmekten mululukar duyuyorum.</h3><br><b>Alperen Nuroğlu</b>", // html body
    //  });
    res.redirect("/account/login?account=true");
})

//? New Password
router.get("/new-password", async (req, res) => {
    const sessionmessage = req.session.message || undefined ;
    delete req.session.message
    res.render("auth/new-password",{message : sessionmessage});
})
router.post("/new-password", async (req, res) => {
    let user = await User.findOne({email : req.body.email}).select("email");
    if(user){
        const token = jwt.sign({user : user.email},"jwtsecretkey");
        user.token = token;
        await user.save();
        await mailer.sendMail({
            from: 'alperennuroglu@hotmail.com', // sender address
            to: user.email, // list of receivers
            subject: "Social Şifre Yenileme", // Subject line
            html: `<p>Parolayı sıfırlamak için butona basınız</p><br>
            <button> <a href='http://localhost:3005/account/reset-password/${token}'>Parolayı Sıfırla</a></button>`,
        });
        req.session.message = { class : "warning", text : "Lütfen mail adresinizi kontrol ediniz !"}
        return res.redirect("/account/login")
    } 
    res.render("auth/new-password",{message : {class : "warning", text : "Lütfen geçerli bir mail adresi giriniz"}})
})


//? Reset Password
router.get("/reset-password/:token", async (req, res) => {
    try{
        jwt.verify(req.params.token,"jwtsecretkey")
    }catch(err){
        return res.redirect("/account/new-password");
    }
    res.render("auth/reset-password")
})

router.post("/reset-password/:token", async (req, res) => {
    try{
        const data = jwt.verify(req.params.token,"jwtsecretkey");
        let user = await User.findOne({email : data.user, token: req.params.token}).select(["-profilImageData","-coverImageData"]);
        if(user){
            user.password = await bcrypt.hash(req.body.password2, 10);
            user.token = null;
            await user.save();
            req.session.message = {class : "success", text : "Parola başarılı bir şekilde güncellendi"}
            return res.redirect("/account/login")
        }
        req.session.message =  {class : "warning", text : "Geçersiz işlem , lütfen tekrardan paralo sıfırmalma mail'i alınız"}
        return res.redirect("/account/new-password")
    }catch(err){
        console.log(err);
        return res.redirect("/account/new-password");
    }
})

//? Logout
router.get("/logout",isLogin, async (req, res) => {
    delete req.session.user;
    req.session.message = {text :"Hesabınızdan başarılı bir şekilde çıkış yaptınız", class : "success" } ;
    res.redirect("/account/login");
})


module.exports = router;
