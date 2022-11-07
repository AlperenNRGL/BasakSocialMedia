const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session')

const authRouter = require("./routes/auth")
const homeRouter = require("./routes/home")
const userRouter = require("./routes/user")

const isLogin = require("./middlewares/isLogin");
const locals = require("./middlewares/locals");

const logger = require("./helpers/winston")



app.use('/static', express.static('doc'))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))


//? Routers
app.use(locals)
app.use("/account", authRouter)
app.use("/user", userRouter)
app.use("/", homeRouter)
app.use((err, req, res, next) => {
    logger.error({message : err})
    console.log(err.message);
    res.render("error/error-404")
    next(err);
})



console.log("object");
(async () => {
    try {
        await mongoose.connect(`mongodb+srv://alperen:135790@social-media.kttxyjd.mongodb.net/Social-Media?retryWrites=true&w=majority`);
        console.log("mongoose completed");
        logger.info({label :"DB",message :"MongoDDB database connect"});
    } catch (err) {
        console.log("!!! Mongoose Database Not Connect !!!");
        logger.error({label :"DB", message : "MongoDB Database not connect"})
    }
})()


app.listen(3005, () => {
    console.log("3005 port listening");
})

