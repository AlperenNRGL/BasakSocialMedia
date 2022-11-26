module.exports = (req, res, next) => {
    res.locals.message = undefined;
    res.locals.success = false;
    next()
}