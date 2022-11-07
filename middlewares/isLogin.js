// const { User } = require("../models/user-model")

module.exports = async (req, res, next) =>{
    if(req.session.user){
        next();
        return;
    }
    return res.redirect("/account/login")
}