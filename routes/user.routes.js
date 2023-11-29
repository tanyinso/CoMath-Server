const express = require('express');
const multer = require('multer');
const {v4:uuid} = require('uuid');
const {registerUser, loginUser, getUser, getUserById, updateUser} = require('../controllers/UserController')
const {userProtected} = require('../middleware/authMiddleware')

const router = express.Router();

const User = require('../models/userModel');
const { route } = require('./content.routes');

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, './public')
     },
     filename: (req, file, cb) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          cb(null, uuid() + '-' + fileName)
     },
})

var upload = multer({
     storage: storage,
     fileFilter: (req, file, cb) => {
         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
             cb(null, true);
             console.log("image uploaded ")
         } else {
             cb(null, false);
             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
         }
     }
 });

 router.post('/register', upload.single('profileImg'), registerUser)
 
 router.get("/",userProtected, getUser);

 router.get('/me/:id', getUserById)

 router.post("/login",loginUser);
 
 router.post("/update/",userProtected, upload.single('profileImg'), updateUser)

 module.exports = router;