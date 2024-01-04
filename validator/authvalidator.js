const joi = require('joi')

const registervalidation = async (req, res, next) => {

    try {
        let schema = joi.object({
            name: joi.string().min(4).max(10).required(),
            email_id: joi.string().email().required(),
            password: joi.string().min(1).max(50).required()
        })

        await schema.validateAsync({ ...req.body })
        next()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "server error " + e
        })
    }
}
const loginvalidation = async (req, res, next) => {
    try {
        let schema = joi.object({
            email_id: joi.string().email({ minDomainSegments: 2 }).required(),
            password: joi.string().min(4).max(10).required()
        })
        await schema.validateAsync({ ...req.body })
        next()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "server error " + e
        })
    }
}

const emailvalidation = async (req, res, next) => {
    try {
        let schema = joi.object({
            email_id: joi.string().email({ minDomainSegments: 2 }).required()
        })
        await schema.validateAsync({ ...req.body })
        next()
    }
    catch (e) {
        return res.status(500).json({

            message: "server error" + e

        })
    }
}

const resetPasswordvalidation = async (req, res, next) => {
    try {
        let schema = joi.object({
            email_id: joi.string().email({ minDomainSegments: 2 }).required(),
            otp: joi.string().min(2).max(4).required(),
            password: joi.string().required()
        })
        await schema.validateAsync({ ...req.body })
        next()

    }
    catch (e) {
        return res.status(500).json({

            message: "server error" + e

        })
    }

}

module.exports = { registervalidation, loginvalidation, emailvalidation, resetPasswordvalidation }