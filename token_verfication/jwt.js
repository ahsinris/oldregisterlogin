const jwt = require('jsonwebtoken')
const tokenverfication = async (req, res, next) => {

    try {
        let accesstoken = req.headers.authorization

        if (!accesstoken) {
            return res.status(401).json({
                status: 401,
                message: "invalid token"
            })
        }
        req.user = jwt.verify(accesstoken, process.env.SECERETKEY)
        next()

    }
    catch (e) {
        console.log(e)
        return res.status(400).json({
            message: "invalid token or expired token"
        })

    }

}
module.exports = { tokenverfication }