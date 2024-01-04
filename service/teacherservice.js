const dbconn = require('../db/dbconfig')

const bcrypt = require('bcrypt')

const transpotter = require('../resetPassword/nodemailer')

const moment = require('moment')
const { resetPasswordvalidation } = require('../validator/authvalidator')

async function registerService(requestdata) {

    const { name, email_id, password } = requestdata

    const [isemailexist] = await dbconn.query(`select * from teacher where email_id =?`, [email_id])

    if (isemailexist.length) {
        return {
            sucess: false,
            status: 400,
            message: "email already exist"
        }

    }
    const hashpassword = await bcrypt.hash(password, Number(process.env.SALTROUND))
    const [result] = await dbconn.query(`insert into teacher (name,email_id,password) values (?,?,?)`, [name, email_id, hashpassword])
    return {
        sucess: true,
        data: result
    }
}

async function loginService(requestdata) {

    const { email_id, password } = requestdata
    const [result] = await dbconn.query(`select * from teacher where email_id =?`, [email_id])

    console.log(result)

    if (!result.length) {
        return {
            sucess: false,
            status: 400,
            message: "kindly register first"
        }

    }
    const isValidPassword = await bcrypt.compare(password, result[0].password)

    if (!isValidPassword) {
        return {
            sucess: false,
            status: 400,
            message: "kindly check ur password"
        }
    }

    delete result[0].password
    return {
        sucess: true,
        data: result
    }

}

async function sendotpservice(email_id) {

    const otp = Math.floor(1000 + Math.random() * 9000)

    await transpotter.sendMail({
        from: "Rishvan's Mail",
        to: email_id,
        subject: "otp",
        html: `please find the otp <br> the otp expired in 15 mins <br> <h2>otp : <b>${otp}</b></h2>`

    })

    const expiredyat = moment().add(15, 'minutes').format("Y-M-D hh:mm")

    await dbconn.query(`insert into OTP (email_id,otp,expiry_at)values(?,?,?)`, [email_id, otp, expiredyat])

    return { sucess: true }



}

async function resetPasswordService(email_id, otp, password) {
    const [isemailexist] = await dbconn.query(`select * from teacher where email_id =?`, [email_id])

    if (!isemailexist.length) {
        return {
            sucess: false,
            status: 400,
            message: "user not found"
        }

    }

    const [isvalidOtp] = await dbconn.query(`select * from OTP where email_id =? and otp=?`, [email_id, otp])

    if (!isvalidOtp.length) {
        return {
            sucess: false,
            status: 401,
            message: "invalid otp"
        }
    }
    console.log(isvalidOtp)

    if (isvalidOtp[0].expiredy_at < (moment().format("Y-M-D hh:mm"))) {
        return {
            sucess: false,
            status: 401,
            message: "otp expired"
        }
    }
    const hashpassword = await bcrypt.hash(password, Number(process.env.SALTROUND))

    await dbconn.query(`update teacher  set password =? where email_id=?`, [hashpassword, email_id])

    return {
        sucess: true
    }
}
async function updateProfileServive(requestData, user) {

    await dbconn.query('update  teacher set email_id = ? where id = ?', [requestData.email_id, user.id])
    return {
        sucess: true
    }
}
module.exports = { registerService, loginService, sendotpservice, resetPasswordService, updateProfileServive }

