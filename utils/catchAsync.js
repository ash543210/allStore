module.exports = func => {
    return (req, res, next) => {
        console.log(err)
        func(req, res, next).catch(next);
    }
}