const router = require('express').Router()
const { registervalidation, loginvalidation, emailvalidation, resetPasswordvalidation } = require('../validator/authvalidator')
const { register, login, sendotp, resetPassword, updateProfile } = require('../controller/studentcontroller')
const { tokenverfication } = require('../token_verfication/jwt')
router.post('/register', registervalidation, register)
router.get('/login', loginvalidation, login)
router.post('/sendOtp', emailvalidation, sendotp)
router.put('/resetpassword', resetPasswordvalidation, resetPassword)
router.put('/updateProfile', tokenverfication, updateProfile)

module.exports = router