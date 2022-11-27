module.exports = (req, res, next) => {
    res.locals.message = undefined;
    res.locals.success = false;
    res.locals.url = "http://basakapiapp-env.eba-byydi3v3.us-east-1.elasticbeanstalk.com"
    next()
}