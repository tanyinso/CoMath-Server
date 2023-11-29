const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Teacher = require('../models/teacherModel')

const userProtected = asyncHandler(async (req, res, next) => {
     let token
     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

          try {
               token = req.headers.authorization.split(' ')[1]
               const decoded = jwt.verify(token, process.env.JWT_SECRET)
               req.user = await User.findById(decoded.id).select('-password')
               next()
          } catch (error) {
               console.log(error)
               res.status(401).json('Not authorised')
               return
          }

     }

     if (!token) {
          res.status(400).json('Not authorised , no token')
          return
     }
})

const teacherProtected = asyncHandler(async (req, res, next) => {
     let token
     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

          try {
               token = req.headers.authorization.split(' ')[1]

               const decoded = jwt.verify(token, process.env.JWT_SECRET)
               req.teacher = await Teacher.findById(decoded.id).select('-password')
               next()
          } catch (error) {
               console.log(error)
               res.status(401).json('Not authorised')
               return 
          }

     }

     if (!token) {
          res.status(400).json('Not authorised , no token')
          return
     }
})

module.exports = {
     userProtected,
     teacherProtected,
}