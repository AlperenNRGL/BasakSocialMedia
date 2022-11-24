module.exports = (req, res, next) => {
    res.locals.message = undefined;
    res.locals.success = false;
    res.locals.request_count = 0
    next()
}