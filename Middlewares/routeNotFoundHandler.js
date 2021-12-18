const routeNotFoundHandler = ( req, res ) => {
    res.status(404).json({ success : false , message :"Oh ho!! Route Not found :("})
}
module.exports = routeNotFoundHandler