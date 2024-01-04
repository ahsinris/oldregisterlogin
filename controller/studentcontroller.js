const { registerService, loginService, sendotpservice, resetPasswordService, updateProfileServive } = require('../service/teacherservice')

const jwt = require('jsonwebtoken')

async function register(req, res) {
    try {

        const result = await registerService(req.body)


        if (!result.sucess) {

            return res.status(result.status).json({
                message: result.message
            })
        }
        return res.status(200).json({
            message: "sucessfully registerd",
            data: result.data
        })


    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "server issue" + e

        })
    }


}

async function login(req, res) {
    try {
        const result = await loginService(req.body)

        if (!result.sucess) {
            return res.status(result.status).json({
                message: result.message,

            })
        }

        const jwtpayload = {
            id: result.data.id,
            email_id: result.data.email_id,
            name: result.data.name,
            phone_number: result.data.phone_number
        }
        jwtpayload.accesstoken = await jwt.sign(jwtpayload, process.env.SECERETKEY, { expiresIn: '1m' })

        return res.status(200).json({
            message: "login sucessfully ",
            data: jwtpayload
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "server issue" + e
        })
    }
}

async function sendotp(req, res) {
    try {
        const result = await sendotpservice(req.body.email_id)

        if (!result.sucess) {
            return res.status(400).json({
                message: "Oops something went wrong",
            })
        }
        return res.status(200).json({
            message: "otp send sucessfully",

        })
    }
    catch (e) {
        return res.status(500).json({
            message: "server error" + e
        })
    }


}

async function resetPassword(req, res) {
    try {
        const { email_id, otp, password } = req.body
        const result = await resetPasswordService(email_id, otp, password)
        if (!result.sucess) {
            return res.status(result.status).json({
                message: result.message
            })
        }
        return res.status(200).json({
            message: "password reset sucessfully"
        })
    }

    catch (e) {
        return res.status(500).json({
            message: "server error" + e
        })
    }

}
async function updateProfile(req, res) {
    try {

        const result = await updateProfileServive(req.body, req.user)

        if (!result.sucess) {
            return res.status(400).json({
                message: "oops something went wrong ",
            })
        }
        return res.status(200).json({
            message: "updated sucessfully"
        })


    }
    catch (e) {
        return res.status(401).json({
            message: "unauthorized" + e
        })
    }

}
module.exports = { register, login, sendotp, resetPassword, updateProfile }


